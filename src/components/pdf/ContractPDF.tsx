"use client";

import { useState } from "react";
import { Download, AlertCircle } from "lucide-react";

interface ContractPDFProps {
  contract: {
    title: string;
    contract_type?: string;
    status: string;
    parties?: string[];
    terms?: string;
    created_at: string;
  };
}

export default function ContractPDFButton({ contract }: ContractPDFProps) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    setGenerating(true);
    setError("");
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let renderer: any;
      try {
        renderer = await import(/* webpackIgnore: true */ "@react-pdf/renderer");
      } catch {
        throw new Error("PDF generation unavailable — install @react-pdf/renderer");
      }

      const { pdf, Document, Page, Text, View, StyleSheet } = renderer;

      const styles = StyleSheet.create({
        page: { padding: 48, fontFamily: "Helvetica" },
        header: { marginBottom: 28 },
        title: { fontSize: 22, fontWeight: "bold", color: "#111" },
        subtitle: { fontSize: 11, color: "#7C7870", marginTop: 4 },
        divider: { borderBottom: "1px solid #E8E6E0", marginVertical: 14 },
        section: { marginBottom: 20 },
        sectionTitle: { fontSize: 12, fontWeight: "bold", color: "#374151", marginBottom: 8, textTransform: "uppercase" },
        row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
        label: { fontSize: 11, color: "#7C7870" },
        value: { fontSize: 11, color: "#111", fontWeight: "bold" },
        statusBadge: { fontSize: 10, color: "#6366F1", fontWeight: "bold" },
        partyRow: { flexDirection: "row", alignItems: "center", marginBottom: 6, paddingLeft: 8 },
        bullet: { fontSize: 11, color: "#6366F1", marginRight: 6 },
        partyName: { fontSize: 11, color: "#111" },
        termsText: { fontSize: 11, color: "#374151", lineHeight: 1.6 },
        signatureRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 32 },
        signatureBlock: { flex: 1, marginHorizontal: 12 },
        signatureLine: { borderBottom: "1px solid #374151", marginBottom: 6, height: 32 },
        signatureLabel: { fontSize: 10, color: "#7C7870" },
      });

      const ContractDoc = () => (
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.header}>
              <Text style={styles.title}>HomeHaven</Text>
              <Text style={styles.subtitle}>Real Estate — Contract Document</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contract Details</Text>
              <View style={styles.row}><Text style={styles.label}>Title</Text><Text style={styles.value}>{contract.title}</Text></View>
              {contract.contract_type && <View style={styles.row}><Text style={styles.label}>Type</Text><Text style={styles.value}>{contract.contract_type}</Text></View>}
              <View style={styles.row}><Text style={styles.label}>Status</Text><Text style={styles.statusBadge}>{contract.status}</Text></View>
              <View style={styles.row}><Text style={styles.label}>Created</Text><Text style={styles.value}>{new Date(contract.created_at).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}</Text></View>
            </View>
            {contract.parties && contract.parties.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Parties Involved</Text>
                {contract.parties.map((party, i) => (
                  <View key={i} style={styles.partyRow}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.partyName}>{party}</Text>
                  </View>
                ))}
              </View>
            )}
            <View style={styles.divider} />
            {contract.terms && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Terms & Conditions</Text>
                <Text style={styles.termsText}>{contract.terms}</Text>
              </View>
            )}
            <View style={styles.divider} />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Signatures</Text>
              <View style={styles.signatureRow}>
                {["Party Signature", "Agent Signature", "Witness Signature"].map((label) => (
                  <View key={label} style={styles.signatureBlock}>
                    <View style={styles.signatureLine} />
                    <Text style={styles.signatureLabel}>{label}</Text>
                    <Text style={styles.signatureLabel}>Date: _______________</Text>
                  </View>
                ))}
              </View>
            </View>
          </Page>
        </Document>
      );

      const blob = await pdf(<ContractDoc />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `contract-${contract.title.replace(/\s+/g, "-").toLowerCase()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "PDF generation failed");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <button onClick={handleDownload} disabled={generating}
        className="flex items-center gap-2 border border-[#E8E6E0] rounded-xl px-4 py-2 text-[13px] font-semibold text-[#7C7870] hover:bg-[#F4F5F7] disabled:opacity-50 transition-colors">
        <Download size={14} />
        {generating ? "Generating…" : "Download Contract PDF"}
      </button>
      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-[12px] text-amber-700">
          <AlertCircle size={12} /> {error}
        </div>
      )}
    </div>
  );
}
