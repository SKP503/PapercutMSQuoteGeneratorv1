/**
 * ============================================================================
 * PaperCut MS Quote Generator V1
 * app.js
 * ----------------------------------------------------------------------------
 * Vanilla JavaScript
 * Live Proposal Preview Updater
 * Does NOT modify HTML or CSS
 * ============================================================================
 */

(() => {
    "use strict";

    /**
     * ------------------------------------------------------------------------
     * Configuration
     * ------------------------------------------------------------------------
     * Each key represents:
     *  input  -> Input element selector
     *  target -> Elements that should update everywhere in the proposal
     *
     * IMPORTANT:
     * Existing placeholder text inside the preview is preserved automatically.
     * If an input is empty, original text is restored.
     * ------------------------------------------------------------------------
     */
    const FIELD_MAP = {

        customerName: {
            input: "#customerName",
            target: "[data-field='customerName']"
        },

        address: {
            input: "#address",
            target: "[data-field='address']"
        },

        contactPerson: {
            input: "#contactPerson",
            target: "[data-field='contactPerson']"
        },

        telephone: {
            input: "#telephone",
            target: "[data-field='telephone']"
        },

        email: {
            input: "#email",
            target: "[data-field='email']"
        },

        proposalDate: {
            input: "#proposalDate",
            target: "[data-field='proposalDate']"
        },

        proposalReference: {
            input: "#proposalReference",
            target: "[data-field='proposalReference']"
        },

        customerReference: {
            input: "#customerReference",
            target: "[data-field='customerReference']"
        },

        subject: {
            input: "#subject",
            target: "[data-field='subject']"
        },

        paymentTerms: {
            input: "#paymentTerms",
            target: "[data-field='paymentTerms']"
        },

        delivery: {
            input: "#delivery",
            target: "[data-field='delivery']"
        },

        validity: {
            input: "#validity",
            target: "[data-field='validity']"
        }

    };

    /**
     * Stores original placeholder text from proposal.
     */
    const originalText = new WeakMap();

    /**
     * ------------------------------------------------------------------------
     * Save Original Placeholder Text
     * ------------------------------------------------------------------------
     */
    function cacheOriginalText() {

        Object.values(FIELD_MAP).forEach(field => {

            document.querySelectorAll(field.target).forEach(el => {

                if (!originalText.has(el)) {
                    originalText.set(el, el.textContent);
                }

            });

        });

    }

    /**
     * ------------------------------------------------------------------------
     * Update all repeated fields
     * ------------------------------------------------------------------------
     */
    function updateField(fieldKey) {

        const config = FIELD_MAP[fieldKey];

        if (!config) return;

        const input = document.querySelector(config.input);

        if (!input) return;

        const value = input.value.trim();

        document.querySelectorAll(config.target).forEach(element => {

            if (value === "") {

                element.textContent = originalText.get(element);

            } else {

                element.textContent = value;

            }

        });

    }

    /**
     * ------------------------------------------------------------------------
     * Bind Live Input Events
     * ------------------------------------------------------------------------
     */
    function bindEvents() {

        Object.keys(FIELD_MAP).forEach(fieldKey => {

            const config = FIELD_MAP[fieldKey];

            const input = document.querySelector(config.input);

            if (!input) return;

            const handler = () => updateField(fieldKey);

            input.addEventListener("input", handler);

            input.addEventListener("change", handler);

            updateField(fieldKey);

        });

    }

    /**
     * ------------------------------------------------------------------------
     * Initialize
     * ------------------------------------------------------------------------
     */
    function init() {

        cacheOriginalText();

        bindEvents();

    }

    /**
     * Wait for DOM
     */
    if (document.readyState === "loading") {

        document.addEventListener("DOMContentLoaded", init);

    } else {

        init();

    }

})();