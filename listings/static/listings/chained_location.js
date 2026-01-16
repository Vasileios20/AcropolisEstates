// listings/static/listings/chained_location.js

document.addEventListener("DOMContentLoaded", function () {
    const regionSelect = document.getElementById("id_region_display");
    const countySelect = document.getElementById("id_county_display");
    const municipalitySelect = document.getElementById("id_municipality_display");
    const langField = document.getElementById("id_language");

    // Hidden ID fields that actually get saved
    const regionIdField = document.getElementById("id_region_id");
    const countyIdField = document.getElementById("id_county_id");
    const municipalityIdField = document.getElementById("id_municipality_id");
    const municipalityGrField = document.getElementById("id_municipality_gr");

    const locationMap = window.locationMap || {};

    /**
     * Filter and populate county dropdown based on selected region
     */
    function filterCounties(regionName, selectedCounty = null) {
        if (!countySelect) return;

        const counties = new Set();
        Object.values(locationMap).forEach(item => {
            if (item.region_name === regionName) {
                counties.add(item.county_name);
            }
        });

        countySelect.innerHTML = '<option value="">---------</option>';

        Array.from(counties).sort().forEach(county => {
            const option = document.createElement('option');
            option.value = county;
            option.textContent = county;
            option.selected = county === selectedCounty;
            countySelect.appendChild(option);
        });

        // Clear municipality when county changes
        if (municipalitySelect) {
            municipalitySelect.innerHTML = '<option value="">---------</option>';
        }

        // If we have a selected county, filter municipalities
        if (selectedCounty) {
            filterMunicipalities(regionName, selectedCounty);
        }
    }

    /**
     * Filter and populate municipality dropdown based on region and county
     */
    function filterMunicipalities(regionName, countyName, selectedMunicipality = null) {
        if (!municipalitySelect) return;

        const municipalities = [];

        Object.entries(locationMap).forEach(([name, item]) => {
            if (
                (!regionName || item.region_name === regionName) &&
                (!countyName || item.county_name === countyName)
            ) {
                municipalities.push({
                    name: name,
                    data: item
                });
            }
        });

        // Sort alphabetically
        municipalities.sort((a, b) => a.name.localeCompare(b.name));

        municipalitySelect.innerHTML = '<option value="">---------</option>';

        municipalities.forEach(({ name, data }) => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            option.dataset.regionId = data.region_id;
            option.dataset.countyId = data.county_id;
            option.dataset.municipalityId = data.municipality_id;

            // Check if this is the selected municipality
            const savedMunicipality = municipalitySelect.getAttribute("data-selected");
            if (name === savedMunicipality || name === selectedMunicipality) {
                option.selected = true;
            }

            municipalitySelect.appendChild(option);
        });
    }

    /**
     * Update hidden ID fields when municipality is selected
     */
    function updateHiddenFields() {
        const selectedOption = municipalitySelect.options[municipalitySelect.selectedIndex];

        if (selectedOption && selectedOption.value) {
            const municipalityName = selectedOption.value;
            const data = locationMap[municipalityName];

            if (data) {
                if (regionIdField) regionIdField.value = data.region_id;
                if (countyIdField) countyIdField.value = data.county_id;
                if (municipalityIdField) municipalityIdField.value = data.municipality_id;
                if (municipalityGrField) municipalityGrField.value = data.municipality_name;

                console.log('Updated hidden fields:', {
                    region_id: data.region_id,
                    county_id: data.county_id,
                    municipality_id: data.municipality_id,
                    municipality_name: data.municipality_name
                });
            }
        }
    }

    /**
     * Event Listeners
     */
    if (regionSelect) {
        regionSelect.addEventListener("change", () => {
            const selectedRegion = regionSelect.value;
            filterCounties(selectedRegion);

            // Clear hidden fields when region changes
            if (regionIdField) regionIdField.value = '';
            if (countyIdField) countyIdField.value = '';
            if (municipalityIdField) municipalityIdField.value = '';
        });
    }

    if (countySelect) {
        countySelect.addEventListener("change", () => {
            const selectedRegion = regionSelect.value;
            const selectedCounty = countySelect.value;
            filterMunicipalities(selectedRegion, selectedCounty);

            // Clear municipality hidden fields when county changes
            if (municipalityIdField) municipalityIdField.value = '';
        });
    }

    if (municipalitySelect) {
        municipalitySelect.addEventListener("change", updateHiddenFields);
    }

    /**
     * Language change handler - reload page with new language
     */
    if (langField) {
        langField.addEventListener("change", function () {
            const selectedLang = langField.value;
            const url = new URL(window.location.href);
            url.searchParams.set("language", selectedLang);

            // Show loading indicator
            const adminContent = document.querySelector('.main');
            if (adminContent) {
                adminContent.style.opacity = '0.5';
                adminContent.style.pointerEvents = 'none';
            }

            window.location.href = url.toString();
        });
    }

    /**
     * Initial population on page load (for editing existing records)
     */
    function initializeSelections() {
        if (!regionSelect || !regionSelect.value) return;

        const selectedRegion = regionSelect.value;
        const selectedCounty = countySelect?.value;
        const selectedMunicipality = municipalitySelect?.getAttribute("data-selected");

        console.log('Initializing with:', {
            region: selectedRegion,
            county: selectedCounty,
            municipality: selectedMunicipality
        });

        // Populate counties for the selected region
        filterCounties(selectedRegion, selectedCounty);

        // If we have a county, populate municipalities
        if (selectedCounty) {
            filterMunicipalities(selectedRegion, selectedCounty, selectedMunicipality);
        }

        // Update hidden fields with current selection
        if (municipalitySelect && selectedMunicipality) {
            setTimeout(updateHiddenFields, 100);
        }
    }

    // Run initialization
    initializeSelections();

    /**
     * Auto-detect language on first load (if not set)
     */
    if (langField && !langField.value) {
        const browserLang = navigator.language || navigator.userLanguage;
        const detectedLang = browserLang.startsWith("el") ? "el" : "en";

        const url = new URL(window.location.href);
        url.searchParams.set("language", detectedLang);
        window.location.href = url.toString();
    }

    /**
     * Form validation before submit
     */
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function (e) {
            // Ensure hidden fields are populated
            if (municipalitySelect && municipalitySelect.value) {
                updateHiddenFields();
            }

            // Validate required location fields
            if (!municipalityIdField || !municipalityIdField.value) {
                alert('Please select a municipality before saving.');
                e.preventDefault();
                return false;
            }
        });
    }
});