import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../carrito.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.css'
})
export class PedidoComponent {

  nombre: string = '';
  celular: string = '';
  direccion: string = '';

  constructor(public carritoService: CarritoService) {}

  get items() {
    return this.carritoService.items();
  }

  get total(): number {
    return this.carritoService.getTotal();
  }

  eliminar(nombre: string): void {
    this.carritoService.eliminarProducto(nombre);
  }

  async realizarPedido(): Promise<void> {

    
    if (!this.nombre || !this.celular || !this.direccion) {
      alert('Por favor completa todos los datos del cliente.');
      return;
    }

    
    if (this.items.length === 0) {
      alert('Tu carrito está vacío. Agrega productos antes de realizar el pedido.');
      return;
    }

   
    const productos = this.items.map(item => ({
      nombre: item.nombre,
      cantidad: item.cantidad,
      precio: item.precio,
      subtotal: item.precio * item.cantidad
    }));

    const datosCliente = {
      nombre: this.nombre,
      celular: this.celular,
      direccion: this.direccion
    };

    const totalPedido = this.total;

    
    await this.generarReciboPDF(
      datosCliente,
      productos,
      totalPedido
    );

    
    alert(
      `¡Gracias ${this.nombre}! Tu pedido por $${this.total.toLocaleString('es-CO')} fue realizado con éxito y el recibo se descargará en un momento.`
    );

    this.carritoService.vaciarCarrito();

    this.nombre = '';
    this.celular = '';
    this.direccion = '';
  }

  async generarReciboPDF(
    cliente: {
      nombre: string;
      celular: string;
      direccion: string;
    },
    productos: any[],
    total: number
  ): Promise<void> {

    const pdf = new jsPDF();

    
    try {
      const logo = await this.cargarImagen('assets/juegoP/logo.png');
      pdf.addImage(logo, 'PNG', 75, 8, 60, 30);
    } catch (e) {
      console.warn('No se encontró la imagen en la ruta especificada. Se omitirá el logo en el PDF.', e);
    }

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);

    pdf.text(
      'MANILA',
      105,
      48,
      { align: 'center' }
    );

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);

    pdf.text(
      'Donde cada sabor se convierte en una experiencia.',
      105,
      56,
      { align: 'center' }
    );

    // Línea separadora
    pdf.line(20, 63, 190, 63);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(17);

    pdf.text(
      'RECIBO DE PEDIDO',
      105,
      76,
      { align: 'center' }
    );

    const fecha = new Date();
    const fechaTexto = fecha.toLocaleDateString('es-CO');
    const horaTexto = fecha.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    });

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);

    pdf.text(`Fecha: ${fechaTexto}`, 20, 88);
    pdf.text(`Hora: ${horaTexto}`, 20, 95);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13);

    pdf.text('Datos del cliente', 20, 110);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);

    pdf.text(`Nombre: ${cliente.nombre}`, 20, 119);
    pdf.text(`Celular: ${cliente.celular}`, 20, 127);
    pdf.text(`Dirección: ${cliente.direccion}`, 20, 135);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13);

    pdf.text('Resumen del pedido', 20, 150);

    pdf.setFontSize(10);

    pdf.text('Producto', 20, 162);
    pdf.text('Cantidad', 105, 162);
    pdf.text('Precio', 135, 162);
    pdf.text('Subtotal', 165, 162);

    pdf.line(20, 166, 190, 166);

    let posicionY = 177;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);

    productos.forEach(producto => {
      pdf.text(
        producto.nombre.substring(0, 35),
        20,
        posicionY
      );

      pdf.text(
        producto.cantidad.toString(),
        108,
        posicionY
      );

      pdf.text(
        `$${producto.precio.toLocaleString('es-CO')}`,
        135,
        posicionY
      );

      pdf.text(
        `$${producto.subtotal.toLocaleString('es-CO')}`,
        165,
        posicionY
      );

      posicionY += 10;
    });

    pdf.line(20, posicionY, 190, posicionY);

    posicionY += 15;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(15);

    pdf.text(
      `TOTAL A PAGAR: $${total.toLocaleString('es-CO')}`,
      20,
      posicionY
    );

    posicionY += 20;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);

    pdf.text(
      '¡Gracias por elegir MANILA!',
      105,
      posicionY,
      { align: 'center' }
    );

    posicionY += 8;

    pdf.setFontSize(9);

    pdf.text(
      'Conserva este recibo como comprobante de tu pedido.',
      105,
      posicionY,
      { align: 'center' }
    );

    pdf.save(`Recibo-Manila-${cliente.nombre}.pdf`);
  }

  async cargarImagen(url: string): Promise<string> {
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
      throw new Error(`Ruta de logo no encontrada: ${url}`);
    }
    const blob = await respuesta.blob();

    return new Promise((resolve, reject) => {
      const lector = new FileReader();
      lector.onloadend = () => resolve(lector.result as string);
      lector.onerror = reject;
      lector.readAsDataURL(blob);
    });
  }
}