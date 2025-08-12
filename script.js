document.addEventListener('DOMContentLoaded', function () {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Mobile menu toggle
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navList = document.querySelector('.navlist');

    mobileMenuButton.addEventListener('click', function () {
        this.classList.toggle('active');
        navList.classList.toggle('active');
    });

    // Form elements
    const registerForm = document.getElementById('registerForm');
    const requiredFields = registerForm.querySelectorAll('[required]');
    const viewDetailsBtn = document.getElementById('viewDetailsBtn');
    const employeePhoto = document.getElementById('employeePhoto');
    let uploadedPhoto = null;

    // Photo upload handling
    employeePhoto.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            // Validate photo
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/pdf'];
            const maxSize = 2 * 1024 * 1024; // 2MB

            if (!validTypes.includes(file.type)) {
                Swal.fire({
                    title: 'Invalid File Type',
                    text: 'Please upload a JPEG, PNG, or GIF image.',
                    icon: 'error',
                    confirmButtonColor: '#dc3545'
                });
                this.value = ''; // Clear the file input button
                return;
            }

            if (file.size > maxSize) {
                Swal.fire({
                    title: 'File Too Large',
                    text: 'Please upload an image smaller than 2MB.',
                    icon: 'error',
                    confirmButtonColor: '#dc3545'
                });
                this.value = ''; // Clear the file input
                return;
            }

            const reader = new FileReader();
            reader.onload = function (event) {
                uploadedPhoto = event.target.result;
                // Update preview if exists
                const previewContainer = document.querySelector('.photo-preview-container');
                if (previewContainer) {
                    previewContainer.innerHTML = `
                        <img src="${uploadedPhoto}" class="photo-preview" alt="Preview">
                        <button class="btn btn-sm btn-danger mt-2" id="removePhotoBtn">Remove Photo</button>
                    `;
                    document.getElementById('removePhotoBtn').addEventListener('click', function () {
                        employeePhoto.value = '';
                        uploadedPhoto = null;
                        previewContainer.innerHTML = `
                            <div class="photo-placeholder">
                                <i class="fas fa-user"></i>
                            </div>
                            <div>No Photo Selected</div>
                        `;
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    });

    // Add real-time validation
    requiredFields.forEach(field => {
        field.addEventListener('input', function () {
            validateField(this);
        });

        field.addEventListener('blur', function () {
            validateField(this);
        });
    });

    // View Details Button functionality
    viewDetailsBtn.addEventListener('click', function () {
        // First validate all required fields
        let isValid = true;
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        if (isValid) {
            showDetailsModal();
        } else {
            Swal.fire({
                title: 'Form Validation Error',
                text: 'Please complete all required fields before viewing details.',
                icon: 'error',
                confirmButtonColor: '#dc3545',
                confirmButtonText: 'OK'
            });

            // Scroll to first error
            const firstError = registerForm.querySelector('.is-invalid');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    // Form submission
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        let isValid = true;
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        if (isValid) {
            // Show loading state
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Processing...';

            // In a real application, you would handle the file upload here
            // For demonstration, we'll just show a success message
            setTimeout(() => {
                Swal.fire({
                    title: 'Registration Successful!',
                    html: `
                        <div class="text-center">
                            ${uploadedPhoto ? `<img src="${uploadedPhoto}" class="detail-photo mb-3" alt="Employee Photo">` : ''}
                            <p>Employee has been registered successfully.</p>
                        </div>
                    `,
                    icon: 'success',
                    confirmButtonColor: '#008000',
                    confirmButtonText: 'OK',
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Reset form after successful submission
                        registerForm.reset();
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Submit Registration';
                        uploadedPhoto = null;
                        const previewContainer = document.querySelector('.photo-preview-container');
                        if (previewContainer) {
                            previewContainer.innerHTML = `
                                <div class="photo-placeholder">
                                    <i class="fas fa-user"></i>
                                </div>
                                <div>No Photo Selected</div>
                            `;
                        }
                    }
                });
            }, 1500);
        } else {
            // Scroll to first error
            const firstError = registerForm.querySelector('.is-invalid');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            Swal.fire({
                title: 'Form Validation Error',
                text: 'Please correct the highlighted fields before submitting.',
                icon: 'error',
                confirmButtonColor: '#dc3545',
                confirmButtonText: 'OK'
            });
        }
    });

    // Field validation function
    function validateField(field) {
        const errorElement = document.getElementById(`${field.id}-error`);

        if (field.checkValidity()) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
            if (errorElement) errorElement.textContent = '';
            return true;
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');

            if (errorElement) {
                if (field.validity.valueMissing) {
                    errorElement.textContent = 'This field is required.';
                } else if (field.validity.typeMismatch) {
                    errorElement.textContent = 'Please enter a valid value.';
                } else {
                    errorElement.textContent = field.validationMessage;
                }
            }

            return false;
        }
    }

    // Create and show details modal
    function showDetailsModal() {
        // Create modal element
        const modal = document.createElement('div');
        modal.className = 'details-modal';

        // Photo display HTML
        const photoDisplay = uploadedPhoto ?
            `<div class="text-center mb-4">
                <img src="${uploadedPhoto}" class="detail-photo" alt="Employee Photo">
            </div>` :
            `<div class="text-center mb-4">
                <div class="photo-placeholder mx-auto">
                    <i class="fas fa-user"></i>
                </div>
                <div>No Photo Uploaded</div>
            </div>`;

        modal.innerHTML = `
            <div class="details-modal-content">
                <div class="details-modal-header">
                    <h3 class="details-modal-title">Registration Details Preview</h3>
                    <button class="details-modal-close">&times;</button>
                </div>
                
                ${photoDisplay}
                
                <!-- Employee Details -->
                <div class="details-section">
                    <h4 class="details-section-title">Employee Information</h4>
                    <div class="details-grid">
                        <div class="detail-item">
                            <div class="detail-label">Last Name</div>
                            <div class="detail-value">${document.getElementById('lname').value}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">First Name</div>
                            <div class="detail-value">${document.getElementById('fname').value}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Middle Name</div>
                            <div class="detail-value">${document.getElementById('mname').value}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Suffix</div>
                            <div class="detail-value">${document.getElementById('suffix').value || 'None'}</div>
                        </div>
                    </div>
                </div>
                
                <!-- Father's Details -->
                <div class="details-section">
                    <h4 class="details-section-title">Employee Status</h4>
                    <div class="details-grid">
                        <div class="detail-item">
                            <div class="detail-label">Gender</div>
                            <div class="detail-value">${document.getElementById('user_gender').value}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Mutual Status</div>
                            <div class="detail-value">${document.getElementById('mutual_status').value}</div>
                        </div>
                    </div>
                </div>
                
                <!-- Mother's Details -->
                <div class="details-section">
                    <h4 class="details-section-title">Employee Address</h4>
                    <div class="details-grid">
                        <div class="detail-item">
                            <div class="detail-label">Place Birth</div>
                            <div class="detail-value">${document.getElementById('place_birth').value}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Permanent Address</div>
                            <div class="detail-value">${document.getElementById('permanent').value}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Temporary Address</div>
                            <div class="detail-value">${document.getElementById('temporary').value}</div>
                    </div>
                </div>
                
                <!-- Address Details -->
                <div class="details-section">
                    <h4 class="details-section-title">Address Information</h4>
                    <div class="details-grid">
                        <div class="detail-item">
                            <div class="detail-label">Province</div>
                            <div class="detail-value">${document.getElementById('province').value}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">City</div>
                            <div class="detail-value">${document.getElementById('city').value}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Barangay</div>
                            <div class="detail-value">${document.getElementById('barangay').value}</div>
                        </div>
                    </div>
                </div>
                
                <div class="details-modal-footer">
                    <button type="button" class="btn btn-secondary" id="closeDetailsBtn">Close</button>
                    <button type="button" class="btn btn-primary" id="confirmDetailsBtn">Confirm and Submit</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';

        // Close modal handlers
        const closeBtn = modal.querySelector('.details-modal-close');
        const closeDetailsBtn = modal.querySelector('#closeDetailsBtn');

        function closeModal() {
            modal.style.animation = 'modalFadeIn 0.3s ease-out reverse';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        }

        closeBtn.addEventListener('click', closeModal);
        closeDetailsBtn.addEventListener('click', closeModal);

        // Click outside modal to close
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Confirm and submit button
        const confirmDetailsBtn = modal.querySelector('#confirmDetailsBtn');
        confirmDetailsBtn.addEventListener('click', function () {
            closeModal();
            registerForm.dispatchEvent(new Event('submit'));
        });
    }

    // Reset form validation on reset
    registerForm.addEventListener('reset', function () {
        requiredFields.forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
            const errorElement = document.getElementById(`${field.id}-error`);
            if (errorElement) errorElement.textContent = '';
        });
        uploadedPhoto = null;
        const previewContainer = document.querySelector('.photo-preview-container');
        if (previewContainer) {
            previewContainer.innerHTML = `
                <div class="photo-placeholder">
                    <i class="fas fa-user"></i>
                </div>
                <div>No Photo Selected</div>
            `;
        }
    });
});