import React, { useState, useEffect } from "react";

// Les styles sont inclus directement pour la simplicité, vous pouvez les externaliser
const styles = {
  formContainer: {
    maxWidth: "500px",
    margin: "20px auto",
    padding: "25px",
    // Utilisation des variables CSS
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
    backgroundColor: "var(--card-background)",
    color: "var(--text-color)", // Pour le texte général du conteneur
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
    color: "var(--text-color)", // Utilisation de la variable
  },
  input: {
    width: "100%",
    padding: "10px",
    // Utilisation des variables CSS
    border: "1px solid var(--border-color)",
    borderRadius: "4px",
    boxSizing: "border-box",
    fontSize: "16px",
    backgroundColor: "var(--background-color)", // Fond de l'input
    color: "var(--text-color)", // Texte de l'input
  },
  select: {
    width: "100%",
    padding: "10px",
    // Utilisation des variables CSS
    border: "1px solid var(--border-color)",
    borderRadius: "4px",
    boxSizing: "border-box",
    fontSize: "16px",
    backgroundColor: "var(--background-color)", // Fond du select
    color: "var(--text-color)", // Texte du select
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
    // Peut nécessiter des styles spécifiques pour bien s'adapter au dark mode
    // ou utiliser une librairie de styles si les inputs par défaut ne changent pas bien.
  },
  button: {
    padding: "12px 20px",
    // Utilisation des variables CSS pour les boutons primaires
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
function RecoveryForm({ onSubmit, initialData = {}, isEditMode = false }) {
  const [formData, setFormData] = useState({
    kompassId: "",
    clientName: "",
    paymentMethod: "Cash", // Valeur par défaut
    bankName: banks[0],
    isFullPayment: false,
    amountDue: "",
    amountPaid: "",
    agentName: "",
    paymentDate: new Date().toISOString().split("T")[0], // Date du jour au format YYYY-MM-DD
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Utilisez useEffect pour charger les données initiales en mode édition
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
        // Formatage de la date pour l'input type="date"
        paymentDate: initialData.paymentDate
          ? new Date(initialData.paymentDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
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
      // S'assurer que les montants sont des nombres
      const dataToSend = {
        ...formData,
        amountDue: Number(formData.amountDue),
        amountPaid: Number(formData.amountPaid),
      };

      // Appelle la fonction onSubmit passée par la page parente
      await onSubmit(dataToSend);
      setSuccess(
        isEditMode
          ? "Paiement mis à jour avec succès !"
          : "Paiement créé avec succès !"
      );

      if (!isEditMode) {
        // Réinitialiser le formulaire après création
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
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue.");
      console.error("Form submission error:", err);
    }
  };

  return (
    <div style={styles.formContainer}>
      <h2 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>
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
            readOnly={isEditMode} // En mode édition, l'ID de l'entreprise est généralement non modifiable
            style={{
              ...styles.input,
              ...(isEditMode && {
                backgroundColor: "#f0f0f0",
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
            <option value="Versement">Versement</option>
          </select>
        </div>

        {/* NOUVEAU CHAMP : Banque */}
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
          <label htmlFor="amountDue" style={styles.label}>
            Montant Dû :
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
