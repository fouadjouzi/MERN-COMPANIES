import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import recoveryService from "../services/recoveryService";

const styles = {
  container: {
    margin: "20px auto",
    maxWidth: "1200px",
    backgroundColor: "var(--card-background)",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
    color: "var(--text-color)",
  },
  tabsContainer: {
    marginBottom: "20px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  tabButton: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.2s",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    border: "1px solid var(--border-color)",
    padding: "10px",
    backgroundColor: "var(--background-color)",
    textAlign: "left",
  },
  td: {
    border: "1px solid var(--border-color)",
    padding: "10px",
    textAlign: "left",
  },
};

function CompanyDashboard() {
  const { kompassId } = useParams(); // Récupère le KOMPASS ID de l'URL
  const [recoveries, setRecoveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uniqueYears, setUniqueYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);

  // Récupérer toutes les données pour ce KOMPASS ID
  useEffect(() => {
    const fetchCompanyRecoveries = async () => {
      try {
        // Utiliser le filtre par kompassId pour ne charger que les données de cette entreprise
        const data = await recoveryService.getRecoveries(kompassId);
        setRecoveries(data);

        // 1. Identifier les années d'édition uniques
        const years = [...new Set(data.map((r) => r.editionYear))]
          .sort()
          .reverse();
        setUniqueYears(years);

        // 2. Sélectionner l'année la plus récente par défaut
        if (years.length > 0) {
          setSelectedYear(years[0]);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            `Erreur lors du chargement des données pour ${kompassId}.`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyRecoveries();
  }, [kompassId]);

  // Filtrer les paiements basés sur l'année sélectionnée
  const filteredRecoveries = recoveries.filter(
    (r) => r.editionYear === selectedYear
  );

  // Fonction de rendu de la liste des paiements filtrés
  const renderRecoveryList = (list) => {
    return (
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Date Paiement</th>
            <th style={styles.th}>Montant Total Dû</th>
            <th style={styles.th}>Montant Payé</th>
            <th style={styles.th}>Solde Restant</th>
            <th style={styles.th}>Détail Facture</th>
          </tr>
        </thead>
        <tbody>
          {list.map((recovery) => {
            const resteAPayer =
              (Number(recovery.amountDue) || 0) -
              (Number(recovery.amountPaid) || 0);

            return (
              <tr key={recovery._id}>
                <td style={styles.td}>
                  {new Date(recovery.paymentDate).toLocaleDateString()}
                </td>
                <td style={styles.td}>{recovery.amountDue} DA</td>
                <td style={styles.td}>{recovery.amountPaid} DA</td>
                <td
                  style={{
                    ...styles.td,
                    fontWeight: "bold",
                    color: resteAPayer > 0 ? "red" : "green",
                  }}
                >
                  {resteAPayer.toFixed(2)} DA
                </td>
                {/* Lien vers la page de détail complète */}
                <td style={styles.td}>
                  <Link to={`/recovery/${recovery._id}`}>Voir Détail</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  if (loading)
    return (
      <div style={styles.container}>
        <p style={styles.loading}>Chargement du dashboard de l'entreprise...</p>
      </div>
    );
  if (error)
    return (
      <div style={styles.container} style={{ color: "red" }}>
        {error}
      </div>
    );

  return (
    <div style={styles.container} className="container">
      <h1 style={{ color: "var(--text-color)", textAlign: "center" }}>
        Dashboard Entreprise : {kompassId}
      </h1>
      <p style={{ color: "var(--text-color)", textAlign: "center" }}>
        Total des paiements trouvés : {recoveries.length}
      </p>

      <h2 style={{ color: "var(--text-color)", marginTop: "30px" }}>
        Filtrer par Édition :
      </h2>
      <div style={styles.tabsContainer}>
        {uniqueYears.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            style={{
              ...styles.tabButton,
              backgroundColor:
                selectedYear === year
                  ? "var(--primary-button-bg)"
                  : "var(--secondary-button-bg)",
              color:
                selectedYear === year
                  ? "var(--primary-button-text)"
                  : "var(--secondary-button-text)",
            }}
          >
            Édition {year}
          </button>
        ))}
      </div>

      <hr style={{ borderColor: "var(--border-color)" }} />

      {selectedYear && (
        <>
          <h3 style={{ color: "var(--text-color)" }}>
            Détails de l'Édition {selectedYear} ({filteredRecoveries.length}{" "}
            paiements)
          </h3>
          {filteredRecoveries.length > 0 ? (
            renderRecoveryList(filteredRecoveries)
          ) : (
            <p style={{ color: "var(--text-color)" }}>
              Aucun paiement enregistré pour cette édition.
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default CompanyDashboard;
