"use client";

import { useState } from "react";
import { Download, AlertCircle } from "lucide-react";

interface InvoicePDFProps {
  invoice: {
    invoice_number: string;
    contact_name?: string;
    total_amount: number;
    due_date?: string;
    issue_date: string;
    line_items?: Array<{
      description: string;
      quantity: number;
      unit_price: number;
      amount: number;
    }>;
  };
}

export default function InvoicePDFButton({ invoice }: InvoicePDFProps) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    setGenerating(true);
    setError("");
    try {
      // Dynamic import — gracefully fails if @react-pdf/renderer not installed
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let renderer: any;
      try {
        renderer = await import(/* webpackIgnore: true */ "@react-pdf/renderer");
      } catch {
        throw new Error("PDF generation unavailable — install @react-pdf/renderer");
      }

      const { pdf, Document, Page, Text, View, StyleSheet } = renderer;

      const styles = StyleSheet.create({
        page: { padding: 40, fontFamily: "Helvetica" },
        header: { marginBottom: 24 },
        title: { fontSize: 24, fontWeight: "bold", color: "#111" },
        subtitle: { fontSize: 12, color: "#7C7870", marginTop: 4 },
        section: { marginBottom: 16 },
        row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
        label: { fontSize: 11, color: "#7C7870" },
        value: { fontSize: 11, color: "#111", fontWeight: "bold" },
        total: { fontSize: 16, color: "#6366F1", fontWeight: "bold" },
        divider: { borderBottom: "1px solid #E8E6E0", marginVertical: 12 },
        tableHeader: { flexDirection: "row", backgroundColor: "#F4F5F7", padding: 8, marginBottom: 4 },
        tableRow: { flexDirection: "row", padding: 8, borderBottom: "1px solid #F0EDE6" },
        col1: { flex: 3, fontSize: 11 },
        col2: { flex: 1, fontSize: 11, textAlign: "right" },
      });

      const InvoiceDoc = () => (
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.header}>
              <Text style={styles.title}>HomeHaven</Text>
              <Text style={styles.subtitle}>Real Estate — Invoice</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.section}>
              <View style={styles.row}><Text style={styles.label}>Invoice Number</Text><Text style={styles.value}>{invoice.invoice_number}</Text></View>
              <View style={styles.row}><Text style={styles.label}>Issue Date</Text><Text style={styles.value}>{invoice.issue_date}</Text></View>
              {invoice.due_date && <View style={styles.row}><Text style={styles.label}>Due Date</Text><Text style={styles.value}>{invoice.due_date}</Text></View>}
              {invoice.contact_name && <View style={styles.row}><Text style={styles.label}>Bill To</Text><Text style={styles.value}>{invoice.contact_name}</Text></View>}
            </View>
            {invoice.line_items && invoice.line_items.length > 0 && (
              <View style={styles.section}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.col1, { fontWeight: "bold" }]}>Description</Text>
                  <Text style={[styles.col2, { fontWeight: "bold" }]}>Qty</Text>
                  <Text style={[styles.col2, { fontWeight: "bold" }]}>Price</Text>
                  <Text style={[styles.col2, { fontWeight: "bold" }]}>Amount</Text>
                </View>
                {invoice.line_items.map((item, i) => (
                  <View key={i} style={styles.tableRow}>
                    <Text style={styles.col1}>{item.description}</Text>
                    <Text style={styles.col2}>{item.quantity}</Text>
                    <Text style={styles.col2}>${item.unit_price.toLocaleString()}</Text>
                    <Text style={styles.col2}>${item.amount.toLocaleString()}</Text>
                  </View>
                ))}
              </View>
            )}
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>Total Amount</Text>
              <Text style={styles.total}>${invoice.total_amount.toLocaleString()}</Text>
            </View>
          </Page>
        </Document>
      );

      const blob = await pdf(<InvoiceDoc />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${invoice.invoice_number}.pdf`;
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
        {generating ? "Generating…" : "Download PDF"}
      </button>
      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-[12px] text-amber-700">
          <AlertCircle size={12} /> {error}
        </div>
      )}
    </div>
  );
}
