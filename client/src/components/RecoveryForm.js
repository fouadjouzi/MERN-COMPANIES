import React, { useState, useEffect } from "react";

// Styles (incluant readOnlyInput pour le Solde)
const styles = {
  formContainer: {
    maxWidth: "500px",
    margin: "20px auto",
    padding: "25px",
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
    backgroundColor: "var(--card-background)",
    color: "var(--text-color)",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
    color: "var(--text-color)",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid var(--border-color)",
    borderRadius: "4px",
    boxSizing: "border-box",
    fontSize: "16px",
    backgroundColor: "var(--background-color)",
    color: "var(--text-color)",
  },
  select: {
    width: "100%",
    padding: "10px",
    border: "1px solid var(--border-color)",
    borderRadius: "4px",
    boxSizing: "border-box",
    fontSize: "16px",
    backgroundColor: "var(--background-color)",
    color: "var(--text-color)",
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
  },
  checkboxInput: {
    marginRight: "10px",
    width: "20px",
    height: "20px",
  },
  button: {
    padding: "12px 20px",
    backgroundColor: "var(--primary-button-bg)",
    color: "var(--primary-button-text)",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background-color 0.2s",
    width: "100%",
  },
  readOnlyInput: {
    backgroundColor: "var(--background-color)",
    color: "var(--text-color)",
    border: "1px solid var(--border-color)",
    borderRadius: "4px",
    padding: "10px",
    width: "100%",
    boxSizing: "border-box",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginTop: "10px",
    marginBottom: "10px",
    textAlign: "center",
  },
  success: {
    color: "green",
    marginTop: "10px",
    marginBottom: "10px",
    textAlign: "center",
  },
};

// Listes de données
const banks = [
  "BEA",
  "BNA",
  "CPA",
  "BDL",
  "BADR",
  "CNEP BANQUE",
  "AL BARAKA",
  "CITIBANK",
  "ABC",
  "NATIXIS ALGERIE",
  "SOCIETE GENERALE ALGERIE",
  "ARABE BANK PLC ALGERIA",
  "BNP PARIBAS AL DJAZAIR",
  "TRUST BANK ALGERIA",
  "HOUSING BANK ALGERIA",
  "HOUSING BANK",
  "AGB",
  "FRANSABANK AL DJAZAIR",
  "CACIBA",
  "HSBC ALGERIA",
  "AL SALAM BANK ALGERIA",
];

const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 2020; i <= currentYear + 1; i++) {
    years.push(i.toString());
  }
  return years;
};
const years = generateYears();

function RecoveryForm({ onSubmit, initialData = {}, isEditMode = false }) {
  const [formData, setFormData] = useState({
    kompassId: "",
    clientName: "",
    paymentMethod: "Cash",
    bankName: banks[0],
    isFullPayment: false,
    amountDue: "", // Montant Total Dû
    amountPaid: "",
    agentName: "",
    paymentDate: new Date().toISOString().split("T")[0],
    editionYear: new Date().getFullYear().toString(),
    invoiceDate: "",
    paymentTotalAmount: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // CALCUL: Solde (Montant Dû - Montant Payé)
  const solde = (() => {
    const total = Number(formData.amountDue);
    const paid = Number(formData.amountPaid);
    if (isNaN(total) || isNaN(paid)) return "N/A";
    const difference = total - paid;
    return difference.toFixed(2);
  })();

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        kompassId: initialData.kompassId || "",
        clientName: initialData.clientName || "",
        paymentMethod: initialData.paymentMethod || "Cash",
        bankName: initialData.bankName || banks[0],
        isFullPayment: initialData.isFullPayment || false,
        amountDue: initialData.amountDue || "",
        amountPaid: initialData.amountPaid || "",
        agentName: initialData.agentName || "",
        paymentDate: initialData.paymentDate
          ? new Date(initialData.paymentDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        editionYear:
          initialData.editionYear || new Date().getFullYear().toString(),
        invoiceDate: initialData.invoiceDate
          ? new Date(initialData.invoiceDate).toISOString().split("T")[0]
          : "",
        paymentTotalAmount: initialData.paymentTotalAmount || "",
      });
    }
  }, [isEditMode, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const dataToSend = {
        ...formData,
        amountDue: formData.amountDue === "" ? 0 : Number(formData.amountDue),
        amountPaid:
          formData.amountPaid === "" ? 0 : Number(formData.amountPaid),
        paymentTotalAmount:
          formData.paymentTotalAmount === ""
            ? 0
            : Number(formData.paymentTotalAmount),
      };

      await onSubmit(dataToSend);
      setSuccess(
        isEditMode
          ? "Paiement mis à jour avec succès !"
          : "Paiement créé avec succès !"
      );

      if (!isEditMode) {
        setFormData({
          kompassId: "",
          clientName: "",
          paymentMethod: "Cash",
          bankName: banks[0],
          isFullPayment: false,
          amountDue: "",
          amountPaid: "",
          agentName: "",
          paymentDate: new Date().toISOString().split("T")[0],
          editionYear: new Date().getFullYear().toString(),
          invoiceDate: "",
          paymentTotalAmount: "",
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue.");
      console.error("Form submission error:", err);
    }
  };

  return (
    <div style={styles.formContainer} className="container">
      <h2
        style={{
          textAlign: "center",
          color: "var(--text-color)",
          marginBottom: "20px",
        }}
      >
        {isEditMode
          ? "Modifier le Paiement"
          : "Enregistrer un Nouveau Paiement"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label htmlFor="kompassId" style={styles.label}>
            KOMPASS ID de l'entreprise :
          </label>
          <input
            type="text"
            id="kompassId"
            name="kompassId"
            value={formData.kompassId}
            onChange={handleChange}
            required
            readOnly={isEditMode}
            style={{
              ...styles.input,
              ...(isEditMode && {
                backgroundColor: "var(--background-color)",
                cursor: "not-allowed",
              }),
            }}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="clientName" style={styles.label}>
            Nom du Client :
          </label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="paymentMethod" style={styles.label}>
            Méthode de Paiement :
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Virement Bancaire</option>
            <option value="Check">Chèque</option>
            <option value="Mobile Money">Mobile Money</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="bankName" style={styles.label}>
            Banque :
          </label>
          <select
            id="bankName"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            required
            style={styles.select}
          >
            {banks.map((bank, index) => (
              <option key={index} value={bank}>
                {bank}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="editionYear" style={styles.label}>
            Année de l'Édition :
          </label>
          <select
            id="editionYear"
            name="editionYear"
            value={formData.editionYear}
            onChange={handleChange}
            required
            style={styles.select}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="invoiceDate" style={styles.label}>
            Date de Facture :
          </label>
          <input
            type="date"
            id="invoiceDate"
            name="invoiceDate"
            value={formData.invoiceDate}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        {/* MONTANT TOTAL À PAYER (amountDue) */}
        <div style={styles.formGroup}>
          <label htmlFor="amountDue" style={styles.label}>
            Montant Total Dû :
          </label>
          <input
            type="number"
            id="amountDue"
            name="amountDue"
            value={formData.amountDue}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            style={styles.input}
          />
        </div>

        {/* MONTANT PAYÉ */}
        <div style={styles.formGroup}>
          <label htmlFor="amountPaid" style={styles.label}>
            Montant Payé :
          </label>
          <input
            type="number"
            id="amountPaid"
            name="amountPaid"
            value={formData.amountPaid}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            style={styles.input}
          />
        </div>

        {/* SOLDE RESTANT (CALCULÉ) */}
        <div style={styles.formGroup}>
          <label htmlFor="solde" style={styles.label}>
            Solde Restant :
          </label>
          <input
            type="text"
            id="solde"
            value={`${solde} DA`}
            readOnly
            style={{
              ...styles.readOnlyInput,
              backgroundColor: "var(--background-color)",
            }}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="paymentTotalAmount" style={styles.label}>
            Montant Total du Paiement :
          </label>
          <input
            type="number"
            id="paymentTotalAmount"
            name="paymentTotalAmount"
            value={formData.paymentTotalAmount}
            onChange={handleChange}
            min="0"
            step="0.01"
            style={styles.input}
          />
        </div>

        <div style={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="isFullPayment"
            name="isFullPayment"
            checked={formData.isFullPayment}
            onChange={handleChange}
            style={styles.checkboxInput}
          />
          <label htmlFor="isFullPayment" style={styles.label}>
            Paiement Total
          </label>
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="agentName" style={styles.label}>
            Nom de l'Agent :
          </label>
          <input
            type="text"
            id="agentName"
            name="agentName"
            value={formData.agentName}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="paymentDate" style={styles.label}>
            Date du Paiement :
          </label>
          <input
            type="date"
            id="paymentDate"
            name="paymentDate"
            value={formData.paymentDate}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <button type="submit" style={styles.button}>
          {isEditMode ? "Mettre à Jour" : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}

export default RecoveryForm;
