const form = document.getElementById('contactForm');

const fields = {
    firstName: document.getElementById('firstName'),
    lastName: document.getElementById('lastName'),
    email: document.getElementById('email'),
    message: document.getElementById('message'),
    consent: document.getElementById('consent'),
    queryGeneral: document.getElementById('queryGeneral'),
    querySupport: document.getElementById('querySupport')
};

const formData = {
    firstName: '',
    lastName: '',
    email: '',
    queryType: '',
    message: '',
    consent: false
};

const specialCharsRegex = /[@#$%&*()_+=]/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showError(fieldId, message) {
    const errorEl = document.getElementById(`error-${fieldId}`);
    const inputEl = document.getElementById(fieldId) || document.querySelector(`[name="${fieldId}"]`);
    if (errorEl) errorEl.textContent = message;
    if (inputEl) {
        inputEl.classList.remove('valid');
        inputEl.classList.add('error');
    }
}

function clearError(fieldId) {
    const errorEl = document.getElementById(`error-${fieldId}`);
    const inputEl = document.getElementById(fieldId);
    if (errorEl) errorEl.textContent = '';
    if (inputEl) {
        inputEl.classList.remove('error');
        inputEl.classList.add('valid');
    }
}

function validateField(name, value) {
    if (!value || (typeof value === 'string' && value.trim().length === 0)) {
        return 'This field is required';
    }

    if (name === 'email') {
        if (!emailRegex.test(value)) {
            return 'Please enter a valid email address';
        }
        if (value.length < 5 || value.length > 30) {
            return 'Email must be between 5 and 30 characters';
        }
        return null;
    }

    if (name === 'queryType' || name === 'consent') {
        return null;
    }

    const trimmed = value.trim();
    if (trimmed.length < 5 || trimmed.length > 30) {
        return 'Must be between 5 and 30 characters';
    }

    if (specialCharsRegex.test(trimmed)) {
        return 'Special characters are not allowed (@#$%&*()_+=)';
    }

    return null;
}

function saveField(name, value) {
    formData[name] = value;
}

fields.firstName.addEventListener('change', (e) => {
    const value = e.target.value;
    saveField('firstName', value);
    const error = validateField('firstName', value);
    error ? showError('firstName', error) : clearError('firstName');
});

fields.lastName.addEventListener('change', (e) => {
    const value = e.target.value;
    saveField('lastName', value);
    const error = validateField('lastName', value);
    error ? showError('lastName', error) : clearError('lastName');
});

fields.email.addEventListener('change', (e) => {
    const value = e.target.value;
    saveField('email', value);
    const error = validateField('email', value);
    error ? showError('email', error) : clearError('email');
});

fields.message.addEventListener('change', (e) => {
    const value = e.target.value;
    saveField('message', value);
    const error = validateField('message', value);
    error ? showError('message', error) : clearError('message');
});

fields.queryGeneral.addEventListener('change', (e) => {
    if (e.target.checked) {
        saveField('queryType', 1);
        document.getElementById('error-queryType').textContent = '';
    }
});

fields.querySupport.addEventListener('change', (e) => {
    if (e.target.checked) {
        saveField('queryType', 2);
        document.getElementById('error-queryType').textContent = '';
    }
});

fields.consent.addEventListener('change', (e) => {
    saveField('consent', e.target.checked);
    document.getElementById('error-consent').textContent = '';
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    let hasErrors = false;

    const firstNameError = validateField('firstName', formData.firstName);
    if (firstNameError) { showError('firstName', firstNameError); hasErrors = true; }

    const lastNameError = validateField('lastName', formData.lastName);
    if (lastNameError) { showError('lastName', lastNameError); hasErrors = true; }

    const emailError = validateField('email', formData.email);
    if (emailError) { showError('email', emailError); hasErrors = true; }

    if (!formData.queryType) {
        showError('queryType', 'Please select a query type');
        hasErrors = true;
    }

    const messageError = validateField('message', formData.message);
    if (messageError) { showError('message', messageError); hasErrors = true; }

    if (!formData.consent) {
        showError('consent', 'You must consent to being contacted');
        hasErrors = true;
    }

    if (hasErrors) return;

    const result = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        queryType: formData.queryType,
        message: formData.message.trim(),
        consent: formData.consent
    };

    console.log(result);
});
