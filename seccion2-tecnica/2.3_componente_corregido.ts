import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const interface Movimiento {
  monto: number;
}

const interface Cliente {
  id: number;
  nombre: string;
  movimientos: Movimiento[];
  saldo?: number;
}

@Component({
  selector: 'app-cliente-list',
  template: `
    <div *ngFor="let c of clientes">
      {{ c.nombre }} - {{ c.saldo }}
    </div>
  `
})
export class ClienteListComponent implements OnInit {
  clientes: Cliente[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  private cargarClientes(): void {
    this.http.get<Cliente[]>('/api/clientes').subscribe({
      next: (data) => {
        this.clientes = data.map(cliente => ({
          ...cliente,
          saldo: this.obtenerTotalSaldo(cliente)
        }));
      },
      error: (err) => console.error('Error al cargar clientes', err)
    });
  }

  private obtenerTotalSaldo(cliente: Cliente): number {
    if (!cliente.movimientos || cliente.movimientos.length === 0) {
      return 0;
    }
    return cliente.movimientos.reduce((total, mov) => total + mov.monto, 0);
  }
}