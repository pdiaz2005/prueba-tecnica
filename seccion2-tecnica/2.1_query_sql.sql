
SELECT TOP (10)
    Cli.Nombre as Nombre,
    SUM(Ped.Total) AS TotalFacturado,
    COUNT(Ped.IdPedido) AS CantidadPedidos,
    (
    SELECT TOP 1 Pro2.Nombre
        FROM Pedidos Ped2
        LEFT JOIN DetallePedido Det2 ON Ped2.IdPedido = Det2.IdPedido
        LEFT JOIN Productos Pro2 ON Det2.IdProducto = Pro2.IdProducto
        WHERE Ped2.IdCliente = Cli.IdCliente
          AND Ped2.Estado = 'PAGADO'
          AND Ped2.Fecha >= DATEADD(DAY, 90, GETDATE())
        GROUP BY Pro2.IdProducto, Pro2.Nombre
        ORDER BY SUM(Det2.Cantidad) DESC
    ) as MasVendido
 FROM Clientes Cli
  LEFT JOIN Pedidos Ped ON Cli.IdCliente = Ped.IdCliente
  LEFT JOIN DetallePedido Det ON Ped.IdPedido = Det.IdPedido
  LEFT JOIN Productos Pro ON Det.IdProducto = Pro.IdProducto
  WHERE Ped.Estado = 'PAGADO' AND
    Ped.Fecha >= DATEADD(DAY, 90, GETDATE())
  GROUP BY Cli.IdCliente,Cli.Nombre
  ORDER BY TotalFacturado DESC;