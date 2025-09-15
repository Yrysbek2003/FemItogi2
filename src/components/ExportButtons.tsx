import React from 'react';
import { Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

interface ExportButtonsProps {
  data: any[];
  filename: string;
  title: string;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ data, filename, title }) => {
  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text(title, 20, 20);
      
      // Add date
      doc.setFontSize(12);
      doc.text(`Дата: ${new Date().toLocaleDateString('ru-RU')}`, 20, 35);
      
      // Add data
      let yPosition = 50;
      data.forEach((item, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        
        const text = Object.entries(item)
          .filter(([key]) => key !== 'id')
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
        
        doc.text(`${index + 1}. ${text}`, 20, yPosition);
        yPosition += 10;
      });
      
      doc.save(`${filename}.pdf`);
      toast.success('PDF файл скачан!');
    } catch (error) {
      toast.error('Ошибка при создании PDF');
    }
  };

  const exportToExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
      XLSX.writeFile(workbook, `${filename}.xlsx`);
      toast.success('Excel файл скачан!');
    } catch (error) {
      toast.error('Ошибка при создании Excel файла');
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={exportToPDF}
        className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
      >
        <FileText className="w-4 h-4" />
        PDF
      </button>
      <button
        onClick={exportToExcel}
        className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
      >
        <Download className="w-4 h-4" />
        Excel
      </button>
    </div>
  );
};