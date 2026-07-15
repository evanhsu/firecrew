/**
 * Lightweight replacements for Bootstrap JS behaviors used in Blade templates.
 */

function initTabs() {
    document.querySelectorAll('[data-toggle="tab"]').forEach((tabLink) => {
        tabLink.addEventListener('click', (event) => {
            event.preventDefault();
            const targetSelector = tabLink.getAttribute('href');
            if (!targetSelector?.startsWith('#')) {
                return;
            }

            const tabList = tabLink.closest('.nav-tabs');
            const tabContent = tabList?.parentElement?.nextElementSibling;
            if (!tabList || !tabContent) {
                return;
            }

            tabList.querySelectorAll('li').forEach((item) => {
                item.classList.remove('active');
            });
            tabLink.parentElement?.classList.add('active');

            tabContent.querySelectorAll('.tab-pane').forEach((pane) => {
                pane.classList.remove('active', 'in');
            });
            const targetPane = tabContent.querySelector(targetSelector);
            targetPane?.classList.add('active', 'in');
        });
    });
}

function initCollapse() {
    document.querySelectorAll('[data-toggle="collapse"]').forEach((trigger) => {
        trigger.addEventListener('click', (event) => {
            event.preventDefault();
            const targetSelector =
                trigger.getAttribute('data-target') ??
                trigger.getAttribute('href');
            if (!targetSelector) {
                return;
            }

            const target = document.querySelector(targetSelector);
            if (!target) {
                return;
            }

            const isExpanded = target.classList.contains('in');
            target.classList.toggle('in', !isExpanded);
            trigger.setAttribute('aria-expanded', String(!isExpanded));
        });
    });
}

function initPopovers() {
    document.querySelectorAll('[data-toggle="popover"]').forEach((trigger) => {
        const title = trigger.getAttribute('title') ?? '';
        const content = trigger.getAttribute('data-content') ?? '';
        trigger.setAttribute('title', `${title}${content ? `: ${content}` : ''}`);
    });
}

function initGeolocationButtons() {
    document.querySelectorAll('.geolocate_button').forEach((button) => {
        button.addEventListener('click', (event) => {
            handleGeoClick(event);
        });
    });
}

function handleGeoClick(event: Event) {
    if (!navigator.geolocation) {
        alert("Sorry, your browser doesn't support the geolocation feature.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            populatePositionFields(
                event,
                position.coords.latitude,
                position.coords.longitude
            );
        },
        (error) => {
            alert(
                "Sorry!\nWe couldn't determine your location. " +
                    "This usually happens when Geolocation access is denied by your browser's security settings.\n\n" +
                    "Search for 'browser location security settings' for troubleshooting suggestions."
            );
            console.log(`Geolocation error: ${error.message}`);
        }
    );
}

function populatePositionFields(
    event: Event,
    latitude: number,
    longitude: number
) {
    const latDeg = Math.floor(Math.abs(latitude));
    const latMin = (Math.abs(latitude) - latDeg) * 60.0;
    const signedLatDeg = latitude >= 0 ? latDeg : latDeg * 1.0;

    const lonDeg = Math.floor(Math.abs(longitude));
    const lonMin = (Math.abs(longitude) - lonDeg) * 60.0;
    const signedLonDeg = longitude < 0 ? lonDeg : lonDeg * -1.0;

    const target = event.target as HTMLElement | null;
    const targetForm = target?.closest('form');
    if (!targetForm) {
        return;
    }

    const setValue = (name: string, value: string | number) => {
        const input = targetForm.querySelector<HTMLInputElement>(
            `input[name=${name}]`
        );
        if (input) {
            input.value = String(value);
        }
    };

    setValue('latitude_deg', signedLatDeg);
    setValue('latitude_min', latMin.toPrecision(6));
    setValue('longitude_deg', signedLonDeg);
    setValue('longitude_min', lonMin.toPrecision(6));
}

function initAircraftReleaseButtons() {
    document.querySelectorAll('.table').forEach((table) => {
        table.addEventListener('click', (event) => {
            const target = event.target as HTMLElement | null;
            const button = target?.closest(
                '.release-aircraft-button'
            ) as HTMLButtonElement | null;
            if (!button) {
                return;
            }

            const row = button.closest('tr');
            if (!row) {
                return;
            }

            const crewId = button.dataset.crewId;
            const csrfToken = button.dataset.csrfToken;
            const tailnumber = button.dataset.aircraftTailnumber ?? '';
            const crewNameCell = row.querySelector('#crew-name-cell');
            const updateButtonCell = row.querySelector('#update-button-cell');

            if (tailnumber === '') {
                row.remove();
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
                if (crewNameCell) {
                    crewNameCell.textContent = '';
                }
                if (updateButtonCell) {
                    updateButtonCell.textContent = '';
                }
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initCollapse();
    initPopovers();
    initGeolocationButtons();
    initAircraftReleaseButtons();
});
