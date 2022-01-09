db.coleccionVentas.drop()
db.coleccionVentas.insertMany( 
    [
        { _id: 0, nombreArticulo: "Nike Air Zoom Terra Kiger 7", categoria: "Zapatillas deporte", precio: 140.00, stock: 20, fechaVenta: new Date("2021-02-13"), precioEmpresa: 70.61, vendedor: "Nike" , cliente: "Sprinter"},
        { _id: 1, nombreArticulo: "Nike Air Max 97", categoria: "Zapatillas deporte", precio: 113.99, stock: 40, fechaVenta: new Date("2021-05-15"), precioEmpresa: 50.93, vendedor: "Nike" , cliente: "Deichmann"},
        { _id: 2, nombreArticulo: "Air Zoom-Type Crater", categoria: "Zapatillas deporte", precio: 149.99, stock: 15, fechaVenta: new Date("2021-02-13"), precioEmpresa: 83.55, vendedor: "Nike" , cliente: "Decimas"},
        { _id: 3, nombreArticulo: "Nike Air Max 97", categoria: "Zapatillas deporte", precio: 180.00, stock: 22, fechaVenta: new Date("2020-07-20"), precioEmpresa: 107.11, vendedor: "Nike" , cliente: "JD"},
        { _id: 4, nombreArticulo: "Nike Air Max 90", categoria: "Zapatillas deporte", precio: 115.55, stock: 150,  fechaVenta: new Date("2021-11-09"), precioEmpresa: 72.49, vendedor: "Nike" , cliente: "InterSport"},
        { _id: 5, nombreArticulo: "Nike Fitness Superrep Go", categoria: "Zapatillas deporte", precio: 67.13, stock: 30,  fechaVenta: new Date("2021-09-03"), precioEmpresa: 33.96, vendedor: "Nike" , cliente: "Oxígeno Sport"},
        { _id: 6, nombreArticulo: "Esential Air Max", categoria: "Riñonera", precio: 26.00, stock: 20, precioEmpresa: 15.86, fechaVenta: new Date("2021-11-30"), vendedor: "Nike" , cliente: "Base"},
        { _id: 7, nombreArticulo: "Air 2.0", categoria: "Riñonera", precio: 52.99, stock: 40,  fechaVenta: new Date("2021-01-22"), precioEmpresa: 41.18, vendedor: "Nike" , cliente: "MasDeporte"},
        { _id: 8, nombreArticulo: "Heritage One Size", categoria: "Riñonera", precio: 16.99, stock: 150,  fechaVenta: new Date("2019-02-13"), precioEmpresa: 9.95, vendedor: "Nike" , cliente: "Sprinter"},
        { _id: 9, nombreArticulo: "Nike Heritage86 Cour Seasonal", categoria: "Gorra", precio: 24.95, stock: 220,  fechaVenta: new Date("2021-06-15"), precioEmpresa: 15.95, vendedor: "Nike" , cliente: "Decimas"},
        { _id: 10, nombreArticulo: "Gorra Barça - Junior FC Barcelona", categoria: "Gorra", precio: 10.00, stock: 100,  fechaVenta: new Date("2020-05-25"), precioEmpresa: 3.45, vendedor: "Nike" , cliente: "Decathlon"},
        { _id: 11, nombreArticulo: "Nike Heritage86 Cour Seasonal", categoria: "Gorra", precio: 22.99, stock: 300,  fechaVenta: new Date("2021-08-04"), precioEmpresa: 10.00, vendedor: "Nike" , cliente: "JD"}

    ] 
)

/*Suma los precios de los artículos que se llamen igual y que su categoría sea zapatillas de deporte */

db.coleccionVentas.aggregate
( 
    [ 
        { $match: { categoria: "Zapatillas deporte" } }, 
        { $group: { _id: "$nombreArticulo", sumaZapatillas: { $sum: "$precio" } } } 
    ] 
)

/*Suma los precios de las gorras que tengan una referencia igual y las agrupa según las tiendas que tengan
ese mismo tipo de artículo */

db.coleccionVentas.aggregate
( 
    [
        { $match: { categoria: "Gorra" } }, 
        { $group: { _id: "$nombreArticulo", sumaGorras: { $sum: "$precio" }, numeroGrupo:{$sum:1} } } 
        
    ] 
)

/*Voy a ver las ganancias totales de las tiendas que tienes dichas riñoneras que han vendido todos 
esos productos */

db.coleccionVentas.aggregate
(
    [
        {$match:{categoria: "Riñonera"}},
      { $project: { nombreArticulo: 1, categoria: 1, total: { $multiply: [ "$precio", "$stock" ] } } }
    ]
 )

 /*Hace primero un filtrado por categoria= gorra y después agrupa por el nombre del artículo y 
 devuelve la media de gorras de cada tipo*/ 

 db.coleccionVentas.aggregate
 (
    [
        {$match:{categoria: "Gorra"}},
        { $group: { _id: "$nombreArticulo", mediaGorras: { $avg: "$stock" } } } 
    ]
 )

/*Pone el precio de las zapatillas al máximo para todos los modelos disponibles */

 db.coleccionVentas.aggregate
 (
    [
        {$match:{categoria: "Zapatillas deporte"}},
        { $project: { nombreArticulo:1, categoria:1 , zapatillasMasCaras: { $max: {valorMaximo: 180} } } } 
    ]
 )

 /*Pone el precio de las zapatillas al mínimo para todos los modelos disponibles */

 db.coleccionVentas.aggregate
 (
    [
        {$match:{categoria: "Zapatillas deporte"}},
        { $project: { nombreArticulo:1, categoria:1 , zapatillasMasBaratas: { $min: {valorMinimo: 67} } } } 
    ]
 )

 /*db.coleccionVentas.aggregate
 (
    [
      { $project: { name: 1, workdays: { $divide: [ "$hours", 8 ] } } }
    ]
 )*/

 db.coleccionVentas.aggregate
 (
    [
        { $match: { $expr:{ $gt: [{ $year: "$fechaVenta" }, 2020] } } },

        {
            $group:
                {
                    _id: { $year: "$fechaVenta" },
                    ventaTotal: { $sum: { $multiply: ["$precio", "$stock"] } }
                }
        },

        {
            $project: {
                año: "$_id",
                _id: 0,
                totalv: "$ventaTotal",
                IVA: { $multiply: ["$ventaTotal", 0.21] },
                totalvIVA: { $multiply: ["$ventaTotal", 1.21] },
                totalRedondeado: { $round: [{ $multiply: ["$ventaTotal", 1.21] }, 0] }
            }
        },
        {
            $match: {
                totalvIVA: { $gt: 300 }
            }
        }
    ]
).pretty()

