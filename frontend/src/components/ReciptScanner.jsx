"use client";

import React from 'react'
import { useRef } from 'react';
import { Camera, Loader } from 'lucide-react';
import useFetch from '../../hooks/use-fetch';
import { Button } from "react";
import axios from 'axios';



export function ReceiptScanner({ onScanComplete }) {
  const fileInputRef = useRef();

  const scanReceiptApi = async (imageData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post('http://localhost:4000/api/expense/scan',
      { image: imageData },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.data.success) {
    // Send data to Add.jsx to fill the form
    onScanComplete(response.data.data);
}
    // Inside your ReceiptScanner component
    React.useEffect(() => {
      if (scannedData && scannedData.success) {
        // Send the AI data back to the parent component (Add.jsx)
        onScanComplete(scannedData.data);
      }
    }, [scannedData, onScanComplete]); // Ensure these dependencies are here
    return response.data; // This returns the AI extracted JSON
  };
  

  const {
    loading: scanReceiptLoading,
    fn: scanReceiptFn,
    data: scannedData,
  } = useFetch(scanReceiptApi);

  const handleReceiptScan = (selectedfile) => {
    if (selectedfile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        scanReceiptFn(reader.result); // This result is the base64 string
      };
      reader.readAsDataURL(selectedfile);
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReceiptScan(file);
        }}
      />
      <button type="button" // Prevents the button from accidentally submitting the main form
        onClick={() => fileInputRef.current.click()} // Triggers the hidden file input
        className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-orange-200 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl transition-all duration-200 group"
      >{scanReceiptLoading ? (
        <>
          <Loader className="mr-2 animate-spin" />
          <span>Scanning...</span>
        </>
      ) : (
        <>
          <Camera className="mr-2" />
          <span>Scan Receipt with AI</span>
        </>)}
      </button>
    </div>
  )
}

export default ReceiptScanner
