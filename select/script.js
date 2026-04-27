const selectWrapper = document.querySelector('.select-wrapper');
const selectHeader = document.getElementById('selectHeader');
const selectLabel = document.getElementById('selectLabel');
const selectOptions = document.querySelectorAll('.select-option');

let isOpen = false;

function toggleDropdown() {
    isOpen = !isOpen;
    selectWrapper.classList.toggle('open', isOpen);
}

function closeDropdown() {
    isOpen = false;
    selectWrapper.classList.remove('open');
}

function selectOption(option) {
    const value = option.textContent;
    
    selectOptions.forEach(opt => opt.classList.remove('selected'));
    option.classList.add('selected');
    
    selectLabel.textContent = value;
    closeDropdown();
}

selectHeader.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown();
});

selectOptions.forEach(option => {
    option.addEventListener('click', (e) => {
        e.stopPropagation();
        selectOption(option);
    });
});

document.addEventListener('click', () => {
    if (isOpen) {
        closeDropdown();
    }
});
