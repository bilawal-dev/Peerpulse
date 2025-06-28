import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";

export async function exportPDF(exportContainerRef: React.RefObject<HTMLDivElement>, pdfName: string) {
    try {
        const element = exportContainerRef.current;
        if (!element) return;

        toast.loading("Generating PDF...", { id: "pdf-export" });

        const canvas = await html2canvas(exportContainerRef.current!, { scale: 2 })
        const pxToMm = (px: number) => px * 0.264583
        const mmW = 210 // A4 width in mm
        const mmH = (canvas.height * mmW) / canvas.width
        const pdf = new jsPDF({ unit: 'mm', format: 'a4' })
        const imgData = canvas.toDataURL('image/png')
        pdf.addImage(imgData, 'PNG', 0, 0, mmW, mmH)
        toast.success("PDF generated successfully!", { id: "pdf-export" });
        pdf.save(pdfName);

    } catch (error) {
        console.error('Error generating PDF:', error);
        toast.error("Error downloading PDF", { id: "pdf-export" });
    }
}