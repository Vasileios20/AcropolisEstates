document.addEventListener("DOMContentLoaded", function () {
    const regionSelect = document.getElementById("id_region_display");
    const countySelect = document.getElementById("id_county_display");
    const municipalitySelect = document.getElementById("id_municipality_display");


    const locationMap = window.locationMap || {};

    function filterCounties(regionName, selectedCounty = null) {
        const counties = new Set();
        Object.values(locationMap).forEach(item => {
            if (item.region_name === regionName) {
                counties.add(item.county_name);
            }
        });

        countySelect.innerHTML = '<option value="">---------</option>';
        counties.forEach(county => {
            const selected = county === selectedCounty ? "selected" : "";
            countySelect.innerHTML += `<option value="${county}" ${selected}>${county}</option>`;
        });

        filterMunicipalities(regionName, selectedCounty, municipalitySelect.value);
    }

    function filterMunicipalities(regionName, countyName, selectedMunicipality = null) {
        const municipalities = [];
        Object.entries(locationMap).forEach(([name, item]) => {
            if (
                (!regionName || item.region_name === regionName) &&
                (!countyName || item.county_name === countyName)
            ) {

                municipalities.push({
                    name: name,
                    id: item.municipality_id
                });

            }
        });


        municipalitySelect.innerHTML = '<option value="">---------</option>';
        municipalities.forEach(({ name, id }) => {
            const selectedMunicipalityName = municipalitySelect?.getAttribute("data-selected");
            const selected = name === selectedMunicipalityName ? "selected" : "";
            municipalitySelect.innerHTML += `<option value="${name}" ${selected}>${name}</option>`;
        });
    }

    if (regionSelect) {
        regionSelect.addEventListener("change", () => {
            const selected = regionSelect.value;
            filterCounties(selected);
        });
    }

    if (countySelect) {
        countySelect.addEventListener("change", () => {
            const selectedRegion = regionSelect.value;
            const selectedCounty = countySelect.value;
            filterMunicipalities(selectedRegion, selectedCounty);
        });
    }

    // Initial population on edit
    if (regionSelect && regionSelect.value) {
        const selectedCounty = countySelect?.value;
        const selectedMunicipality = municipalitySelect?.value;

        filterCounties(regionSelect.value, selectedCounty);
        if (selectedCounty) {
            filterMunicipalities(regionSelect.value, selectedCounty, selectedMunicipality);
        }
    }

    // Language detection
    const langField = document.getElementById("id_language");
    if (langField && !langField.value) {
        const browserLang = navigator.language || navigator.userLanguage;
        const detectedLang = browserLang.startsWith("el") ? "el" : "en";
        langField.value = detectedLang;

        const form = langField.closest("form");
        if (form) {
            form.submit();
        } else {
            const url = new URL(window.location.href);
            url.searchParams.set("language", detectedLang);
            window.location.href = url.toString();
        }
    }

    if (langField) {
        langField.addEventListener("change", function () {
            const selectedLang = langField.value;
            const url = new URL(window.location.href);
            url.searchParams.set("language", selectedLang);
            window.location.href = url.toString();
        });
    }
});