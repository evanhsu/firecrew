function withoutInvalidChars(str: string) {
    return str
        .replace('/', '')
        .replace('\\', '')
        .replace('"', '')
        .replace("'", '')
        .replace('?', '')
        .replace('=', '')
        .replace(' ', '');
}

function setStatusForAddButton() {
    const blankFieldExists = Array.from(
        document.querySelectorAll<HTMLInputElement>(
            '.form .aircraft-identifier'
        )
    ).some((field) => field.value === '');

    const addButton = document.getElementById(
        'add-aircraft-button'
    ) as HTMLButtonElement | null;
    if (!addButton) {
        return;
    }

    if (blankFieldExists) {
        addButton.disabled = true;
        addButton.title =
            'Fill in the existing aircraft form before adding another.';
    } else {
        addButton.disabled = false;
        addButton.title = 'Assign another aircraft to this crew';
    }
}

function enableSaveButton(enable: boolean) {
    const saveButton = document.querySelector<HTMLButtonElement>(
        'button[type=submit]'
    );
    if (!saveButton) {
        return;
    }

    saveButton.disabled = !enable;
    saveButton.title = enable
        ? 'Save all changes'
        : 'Fix the invalid tailnumber before saving';
}

function validateTailnumbers(field: HTMLInputElement) {
    const pattern = /^[NC]-?[0-9a-z]{3,5}$/i;
    const message = field.parentElement?.querySelector(
        '.identifier-validation-message'
    );
    const formGroup = field.closest('.form-group');

    if (!pattern.test(field.value)) {
        enableSaveButton(false);
        message?.classList.remove('hidden');
        if (message) {
            message.textContent = 'Invalid tailnumber';
        }
        formGroup?.classList.add('has-error');
    } else {
        message?.classList.add('hidden');
        if (message) {
            message.textContent = '';
        }
        formGroup?.classList.remove('has-error');
        enableSaveButton(true);
    }
}

function initCrewEditForm() {
    const form = document.getElementById('edit_crew_form');
    if (!form) {
        return;
    }

    const addButton = document.getElementById('add-aircraft-button');
    addButton?.addEventListener('click', () => {
        const indexElement = document.getElementById('aircraft-index');
        const i = parseInt(indexElement?.textContent ?? '0', 10);
        const template = document.querySelector('.dynamic-form-template');
        const placeholder = document.getElementById(
            'dynamic-form-insert-placeholder'
        );

        if (!template || !placeholder) {
            return;
        }

        const newForm = template.cloneNode(true) as HTMLElement;
        newForm.classList.remove('dynamic-form-template');

        const identifier = newForm.querySelector<HTMLInputElement>(
            '.aircraft-identifier'
        );
        const model = newForm.querySelector<HTMLSelectElement>('.aircraft-model');
        // Both the disabled display input and the hidden submit input share this class.
        // querySelectorAll is required — jQuery's .prop() updated every match; a single
        // querySelector only renamed the disabled field (which is never submitted).
        const typeInputs = newForm.querySelectorAll<HTMLInputElement>(
            '.aircraft-type'
        );
        const releaseButton = newForm.querySelector<HTMLButtonElement>(
            '.release-aircraft-button'
        );

        if (identifier) {
            identifier.name = `crew[statusableResources][${i}][identifier]`;
        }
        if (model) {
            model.name = `crew[statusableResources][${i}][model]`;
        }
        typeInputs.forEach((type) => {
            type.name = `crew[statusableResources][${i}][resource_type]`;
        });
        if (releaseButton) {
            releaseButton.dataset.aircraftId = String(i);
        }

        placeholder.parentElement?.insertBefore(newForm, placeholder);
        if (indexElement) {
            indexElement.textContent = String(i + 1);
        }

        if (addButton instanceof HTMLButtonElement) {
            addButton.disabled = true;
            addButton.title =
                'Fill in the existing aircraft form before adding another.';
        }
    });

    form.addEventListener('keyup', (event) => {
        const target = event.target as HTMLElement | null;
        if (!target?.classList.contains('aircraft-identifier')) {
            return;
        }
        setStatusForAddButton();
        validateTailnumbers(target as HTMLInputElement);
    });

    form.addEventListener('click', (event) => {
        const target = event.target as HTMLElement | null;
        const button = target?.closest(
            '.release-aircraft-button'
        ) as HTMLButtonElement | null;
        if (!button) {
            return;
        }

        const parent = button.closest('.crew-aircraft-form') as HTMLElement | null;
        const identifier = parent?.querySelector<HTMLInputElement>(
            '.aircraft-identifier'
        );
        const tailnumber = withoutInvalidChars(
            identifier?.value.trim() ?? ''
        );
        const csrfToken = form
            .querySelector<HTMLInputElement>("input[name='_token']")
            ?.value;
        const crewId = form.querySelector<HTMLInputElement>(
            "input[name='crew_id']"
        )?.value;

        if (tailnumber === '') {
            parent?.remove();
            setStatusForAddButton();
            return;
        }

        const body = new URLSearchParams({
            _token: csrfToken ?? '',
            'sent-from-crew': crewId ?? '',
        });

        fetch(`/aircraft/${encodeURIComponent(tailnumber)}/release`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body,
        }).then((response) => {
            if (!response.ok) {
                throw new Error('Release failed');
            }
            parent?.remove();
        });
    });
}

document.addEventListener('DOMContentLoaded', initCrewEditForm);
