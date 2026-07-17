/* ============================================================
   PapercutMSQuoteGeneratorV1  —  app.js
   - Two-way binding: form panel  <->  inline proposal fields
   - Line items: add / remove rows, live line totals
   - Single Total (no VAT, no subtotal)
   ============================================================ */

(function () {
    "use strict";

    /* -------------------------------------------------
       1. TEXT FIELD BINDING (form <-> proposal spans)
       ------------------------------------------------- */
    function proposalNodes(key) {
        return document.querySelectorAll('[data-field="' + key + '"]');
    }

    function setField(key, value) {
        proposalNodes(key).forEach(function (node) {
            node.textContent = value;
        });
    }

    // Form input -> proposal
    document.querySelectorAll("[data-bind]").forEach(function (input) {
        var key = input.getAttribute("data-bind");
        setField(key, input.value);
        input.addEventListener("input", function () {
            setField(key, input.value);
        });
    });

    // Proposal inline edit -> form
    document.querySelectorAll("[data-field]").forEach(function (node) {
        node.setAttribute("contenteditable", "true");
        node.setAttribute("spellcheck", "false");
        node.addEventListener("input", function () {
            var key = node.getAttribute("data-field");
            proposalNodes(key).forEach(function (twin) {
                if (twin !== node) twin.textContent = node.textContent;
            });
            var input = document.querySelector('[data-bind="' + key + '"]');
            if (input) input.value = node.textContent;
        });
    });

    /* -------------------------------------------------
       2. COMMERCIALS — LINE ITEMS + TOTAL (no VAT)
       ------------------------------------------------- */
    var lineItems = [
        {
            desc: "Papercut MF Emd License support renewal for 1 Year x 6 devices\nLocal remote support",
            qty: 1,
            price: 4296.00
        }
    ];

    var editorList = document.getElementById("line-items-editor");
    var tableBody  = document.getElementById("line-items-body");
    var tableFoot  = document.getElementById("line-items-foot");

    function money(n) {
        return n.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function lineTotal(item) {
        var q = parseFloat(item.qty) || 0;
        var p = parseFloat(item.price) || 0;
        return q * p;
    }

    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    /* ---- Editor rows (left panel) ---- */
    function renderEditorRows() {
        editorList.innerHTML = "";
        lineItems.forEach(function (item, i) {
            var row = document.createElement("div");
            row.className = "li-row";
            row.innerHTML =
                '<button type="button" class="li-remove" data-i="' + i + '" title="Remove line">&times;</button>' +
                '<label>Description' +
                    '<textarea data-field-edit="desc" data-i="' + i + '">' + escapeHtml(item.desc) + '</textarea>' +
                '</label>' +
                '<div class="li-grid">' +
                    '<label>Qty' +
                        '<input type="number" min="0" step="1" data-field-edit="qty" data-i="' + i + '" value="' + item.qty + '">' +
                    '</label>' +
                    '<label>Unit Price (AED)' +
                        '<input type="number" min="0" step="0.01" data-field-edit="price" data-i="' + i + '" value="' + item.price + '">' +
                    '</label>' +
                '</div>';
            editorList.appendChild(row);
        });

        editorList.querySelectorAll("[data-field-edit]").forEach(function (el) {
            el.addEventListener("input", function () {
                var i = parseInt(el.getAttribute("data-i"), 10);
                var field = el.getAttribute("data-field-edit");
                lineItems[i][field] = el.value;
                renderProposalTable();
            });
        });
        editorList.querySelectorAll(".li-remove").forEach(function (btn) {
            btn.addEventListener("click", function () {
                var i = parseInt(btn.getAttribute("data-i"), 10);
                lineItems.splice(i, 1);
                if (lineItems.length === 0) {
                    lineItems.push({ desc: "", qty: 1, price: 0 });
                }
                renderEditorRows();
                renderProposalTable();
            });
        });
    }

    /* ---- Proposal commercials table (right) ---- */
    function renderProposalTable() {
        tableBody.innerHTML = "";
        var total = 0;
        lineItems.forEach(function (item, i) {
            var lt = lineTotal(item);
            total += lt;
            var tr = document.createElement("tr");
            tr.innerHTML =
                '<td class="col-item">' + (i + 1) + '</td>' +
                '<td class="col-desc">' + escapeHtml(item.desc).replace(/\n/g, "<br>") + '</td>' +
                '<td class="col-qty">' + (parseFloat(item.qty) || 0) + '</td>' +
                '<td class="col-charges">' + money(lt) + '</td>';
            tableBody.appendChild(tr);
        });

        // Single Total row (no VAT, no subtotal)
        tableFoot.innerHTML =
            '<tr class="grand">' +
                '<td></td><td></td>' +
                '<td class="foot-label">Total (AED)</td>' +
                '<td class="foot-value">' + money(total) + '</td>' +
            '</tr>';
    }

    document.getElementById("add-row").addEventListener("click", function () {
        lineItems.push({ desc: "", qty: 1, price: 0 });
        renderEditorRows();
        renderProposalTable();
    });

    /* -------------------------------------------------
       3. PRINT
       ------------------------------------------------- */
    document.getElementById("print-btn").addEventListener("click", function () {
        window.print();
    });

    /* INIT */
    renderEditorRows();
    renderProposalTable();

})();
