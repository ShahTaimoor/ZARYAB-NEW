import React from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { PDFDocument, rgb } from "pdf-lib";

const OrderData = ({
  price,
  address,
  createdAt,
  products,
  paymentMethod = "COD",
  status = "Pending",
}) => {

    
  const handleDownloadInvoice = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]);

      // Header
      page.drawRectangle({
        x: 0,
        y: 720,
        width: 600,
        height: 80,
        color: rgb(0, 0.53, 0.71),
      });
      page.drawText("INVOICE", {
        x: 50,
        y: 750,
        size: 28,
        color: rgb(1, 1, 1),
      });
      page.drawText("GUL", {
        x: 400,
        y: 750,
        size: 12,
        color: rgb(1, 1, 1),
      });
      page.drawText("GUL AUTOS", { x: 400, y: 735, size: 10 });
      page.drawText("Email: support@company.com", { x: 400, y: 705, size: 10 });
      page.drawText("Phone: +11111111111", { x: 400, y: 690, size: 10 });

      // Order Details Heading
      page.drawText("Order Details", {
        x: 50,
        y: 670,
        size: 16,
        color: rgb(0, 0, 0),
      });

      // Table Header
      page.drawRectangle({
        x: 50,
        y: 500,
        width: 500,
        height: 20,
        color: rgb(0.85, 0.85, 0.85),
      });
      page.drawText("Item", { x: 60, y: 505, size: 12 });
      page.drawText("Quantity", { x: 200, y: 505, size: 12 });
      page.drawText("Price", { x: 300, y: 505, size: 12 });
      page.drawText("Total", { x: 450, y: 505, size: 12 });

      // Table Rows
      let yOffset = 485;
      products.forEach((product) => {
        page.drawText(
          `${product?.id?.title || "Product"}...`,
          {
            x: 60,
            y: yOffset,
            size: 12,
          }
        );
        page.drawText(`${product?.quantity}`, { x: 200, y: yOffset, size: 12 });
        page.drawText(`Rs.${product?.id?.price}`, { x: 300, y: yOffset, size: 12 });
        page.drawText(`Rs.${product?.quantity * product?.id?.price}`, {
          x: 450,
          y: yOffset,
          size: 12,
        });
        yOffset -= 20;
      });

      // Footer
      page.drawRectangle({
        x: 0,
        y: 0,
        width: 600,
        height: 40,
        color: rgb(0.1, 0.1, 0.1),
      });
      page.drawText("Thank you for your order!", {
        x: 230,
        y: 15,
        size: 12,
        color: rgb(1, 1, 1),
      });

      // Download
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "invoice.pdf";
      link.click();
    } catch (error) {
      console.error("Error generating PDF invoice:", error);
    }
  };

  return (
    <Card className="grid gap-2 p-2">
      {products.map((product, idx) => (
        <div
          key={idx}
          className="flex flex-col sm:flex-row justify-between items-end sm:items-center border p-3 rounded-lg bg-gray-100"
        >
          <div className="flex items-center gap-2">
            <img
              src={
                product?.id?.picture?.secure_url
                  ? product.id.picture.secure_url
                  : "fallback.jpg"
              }
              alt={product?.id?.title || "Product image"}
              className="h-20 w-20 rounded-lg object-cover"
            />
            <div className="grid">
              <h1>{product?.id?.title|| "Unnamed Product"}</h1>
              <div className="flex flex-col gap-1 text-sm text-gray-600">
                <span>
                  <strong>Qty:</strong> {product.quantity}
                </span>
                
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
        <span>Order On: {new Date(createdAt).toDateString()}</span>
        <span>
          Status: <strong>{status}</strong>
        </span>
        <span>
          Payment: <strong>{paymentMethod}</strong>
        </span>
      </div>
      <hr />
      <span>
        Delivery Address: <strong>{address}</strong>
      </span>
      <Button onClick={handleDownloadInvoice}>Download Invoice</Button>
    </Card>
  );
};

export default OrderData;
