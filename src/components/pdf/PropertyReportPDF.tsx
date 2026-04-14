"use client";

import { useState } from "react";
import { Download, AlertCircle } from "lucide-react";

interface PropertyReportPDFProps {
  property: {
    address: string;
    city?: string;
    beds?: number;
    baths?: number;
    sqft?: number;
    list_price?: number;
    status: string;
    property_type: string;
  };
}

export default function PropertyReportPDFButton({ property }: PropertyReportPDFProps) {
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
        sectionTitle: { fontSize: 12, fontWeight: "bold", color: "#374151", marginBottom: 10, textTransform: "uppercase" },
        row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid #F9F8F6" },
        label: { fontSize: 11, color: "#7C7870" },
        value: { fontSize: 11, color: "#111", fontWeight: "bold" },
        statsGrid: { flexDirection: "row", gap: 12, marginBottom: 16 },
        statCard: { flex: 1, backgroundColor: "#F4F5F7", borderRadius: 8, padding: 12, alignItems: "center" },
        statValue: { fontSize: 18, fontWeight: "bold", color: "#6366F1", marginBottom: 4 },
        statLabel: { fontSize: 10, color: "#7C7870" },
        priceHighlight: { fontSize: 28, fontWeight: "bold", color: "#111", marginBottom: 4 },
        priceLabel: { fontSize: 11, color: "#7C7870" },
        footer: { position: "absolute", bottom: 32, left: 48, right: 48, flexDirection: "row", justifyContent: "space-between" },
        footerText: { fontSize: 9, color: "#C5BFB5" },
      });

      const PropertyDoc = () => (
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.header}>
              <Text style={styles.title}>HomeHaven</Text>
              <Text style={styles.subtitle}>Real Estate — Property Report</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Property Details</Text>
              <View style={styles.row}><Text style={styles.label}>Address</Text><Text style={styles.value}>{property.address}</Text></View>
              {property.city && <View style={styles.row}><Text style={styles.label}>City</Text><Text style={styles.value}>{property.city}</Text></View>}
              <View style={styles.row}><Text style={styles.label}>Property Type</Text><Text style={styles.value}>{property.property_type}</Text></View>
              <View style={styles.row}><Text style={styles.label}>Status</Text><Text style={styles.value}>{property.status}</Text></View>
            </View>
            {(property.beds || property.baths || property.sqft) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Specifications</Text>
                <View style={styles.statsGrid}>
                  {property.beds != null && <View style={styles.statCard}><Text style={styles.statValue}>{property.beds}</Text><Text style={styles.statLabel}>Bedrooms</Text></View>}
                  {property.baths != null && <View style={styles.statCard}><Text style={styles.statValue}>{property.baths}</Text><Text style={styles.statLabel}>Bathrooms</Text></View>}
                  {property.sqft != null && <View style={styles.statCard}><Text style={styles.statValue}>{property.sqft.toLocaleString()}</Text><Text style={styles.statLabel}>Sq Ft</Text></View>}
                </View>
              </View>
            )}
            <View style={styles.divider} />
            {property.list_price != null && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Financial Summary</Text>
                <View style={{ alignItems: "flex-start", marginBottom: 16 }}>
                  <Text style={styles.priceLabel}>Listing Price</Text>
                  <Text style={styles.priceHighlight}>CA${property.list_price.toLocaleString()}</Text>
                </View>
                {property.sqft && property.list_price && (
                  <View style={styles.row}>
                    <Text style={styles.label}>Price per Sq Ft</Text>
                    <Text style={styles.value}>CA${Math.round(property.list_price / property.sqft).toLocaleString()}</Text>
                  </View>
                )}
              </View>
            )}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Generated by HomeHaven Real Estate</Text>
              <Text style={styles.footerText}>{new Date().toLocaleDateString("en-CA")}</Text>
            </View>
          </Page>
        </Document>
      );

      const blob = await pdf(<PropertyDoc />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `property-report-${property.address.replace(/\s+/g, "-").toLowerCase()}.pdf`;
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
        {generating ? "Generating…" : "Download Property Report"}
      </button>
      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-[12px] text-amber-700">
          <AlertCircle size={12} /> {error}
        </div>
      )}
    </div>
  );
}
