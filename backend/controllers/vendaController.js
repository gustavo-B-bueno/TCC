const Model = require('../models/Venda');
const sequelize = require('../config/database');

const { validationResult } = require('express-validator');

const PDFDocument = require('pdfkit');
const { Table } = require('pdfkit-table');

exports.getAll = async (req, res) => {
    try {
        const data = await Model.findAll();
        console.log(data)
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao listar todos os registros'
        })
    }
}

exports.getById = async (req, res) => {

    try {
        const data = await Model.findByPk(req.params.id);
        console.log(data);
        if(data){
            res.status(201).json(data)
        } else {
            res.status(404).json({error: 'Registro não encontrado'});
        }
    } catch (error) {
        res.status(500).json({error : 'Error ao buscar registro'});
    }
}

exports.create = async (req, res) => {

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const data = await Model.create(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({error: 'Error ao criar registro'})
    }
}

exports.update = async (req, res) => {
    try {
        const data = await Model.findByPk(req.params.id);
        if(data){
            await data.update(req.body);
            res.json(data);
        } else {
            res.status(404).json({error: 'Registro nao encontrato'})
        }
    } catch (error) {
        res.status(500).json({error: 'Error ao atualizar o registro'});
    }
}

exports.delete = async (req, res) => {
    try {
      const data = await Model.findByPk(req.params.id);
      if(data){
          await data.destroy({
              where: {
                  id: req.params.id
              }
          })
          res.status(204).send();
      } else {
          res.status(404).json({error: 'Registro não encontrato'})
      }
    } catch (error) {
        res.status(500).json({error: 'Erro ao deletar registro'});
    }
}

// Retorna a quantidade total de vendas
exports.getMostSoldProducts = async (req, res) => {
    try {
        const data = await Model.findAll({
            attributes: [
                'nomeProduto',
                [sequelize.fn('COUNT', sequelize.col('nomeProduto')), 'totalVendas']
            ],
            group: ['nomeProduto'],
            order: [[sequelize.literal('totalVendas'), 'DESC']]
        });

        if (data.length > 0) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ error: 'Nenhum produto encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar os produtos mais vendidos' });
    }
};

// Gera um PDF com os produtos mais vendidos
exports.generateMostSoldProductsPDF = async (req, res) => {
    try {
        const data = await Model.findAll({
            attributes: [
                'nomeProduto',
                [sequelize.fn('COUNT', sequelize.col('nomeProduto')), 'totalVendas']
            ],
            group: ['nomeProduto'],
            order: [[sequelize.literal('totalVendas'), 'DESC']]
        });

        if (data.length > 0) {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            let buffers = [];
            let pageNumber = 1;
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString();
            const formattedTime = currentDate.toLocaleTimeString();

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                let pdfData = Buffer.concat(buffers);
                res.writeHead(200, {
                    'Content-Length': Buffer.byteLength(pdfData),
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment;filename=relatorio-produtos-mais-vendidos.pdf',
                }).end(pdfData);
            });

            const addHeader = () => {
                doc.fontSize(10).text(`Data: ${formattedDate} - Hora: ${formattedTime}`, 50, 30, { align: 'left' });
                doc.text(`Página ${pageNumber}`, 500, 30, { align: 'right' });
                doc.fontSize(16).text('Relatório de Produtos', 50, 60, { width: 500, align: 'center' });
                doc.moveTo(50, 90).lineTo(550, 90).stroke();
            };

            addHeader();

            const startX = 50;
            const col2X = 300;
            const endX = 550;
            let currentY = 110;

            doc.fontSize(12)
                .text('Nome do Produto', startX, currentY)
                .text('Total de Vendas', col2X, currentY, { align: 'center', width: endX - col2X });
            doc.moveTo(startX, currentY + 15).lineTo(endX, currentY + 15).stroke();
            currentY += 25;

            data.forEach((item, index) => {
                if (currentY > 700) {
                    doc.addPage();
                    pageNumber++;
                    currentY = 50;
                    addHeader();
                    currentY = 110;
                }

                doc.text(item.nomeProduto, startX, currentY);
                doc.text(item.dataValues.totalVendas.toString(), col2X, currentY, { align: 'center', width: endX - col2X });
                currentY += 20;
            });

            doc.end();
        } else {
            res.status(404).json({ error: 'Nenhum produto encontrado' });
        }
    } catch (error) {
        console.error('Erro ao gerar o PDF:', error);
        res.status(500).json({ error: 'Erro ao buscar os produtos mais vendidos' });
    }
};

// Vendedor que mais vendeu
exports.getTopSellers = async (req, res) => {
    try {
        const data = await Model.findAll({
            attributes: [
                'nomeVendedor',
                [sequelize.fn('COUNT', sequelize.col('nomeVendedor')), 'totalVendas']
            ],
            group: ['nomeVendedor'],
            order: [[sequelize.literal('totalVendas'), 'DESC']]
        });

        if (data.length > 0) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ error: 'Nenhuma venda encontrada' });
        }
    } catch (error) {
        console.error('Erro ao buscar os vendedores com mais vendas:', error);
        res.status(500).json({ error: 'Erro ao buscar os vendedores com mais vendas' });
    }
};

// Gera um PDF com os vendedores que mais venderam
exports.generateTopSellersPDF = async (req, res) => {
    try {
        const data = await Model.findAll({
            attributes: [
                'nomeVendedor',
                [sequelize.fn('COUNT', sequelize.col('nomeVendedor')), 'totalVendas']
            ],
            group: ['nomeVendedor'],
            order: [[sequelize.literal('totalVendas'), 'DESC']]
        });

        if (data.length > 0) {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            let buffers = [];
            let pageNumber = 1;
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString();
            const formattedTime = currentDate.toLocaleTimeString();

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                let pdfData = Buffer.concat(buffers);
                res.writeHead(200, {
                    'Content-Length': Buffer.byteLength(pdfData),
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment;filename=relatorio-top-sellers.pdf',
                }).end(pdfData);
            });

            const addHeader = () => {
                doc.fontSize(10).text(`Data: ${formattedDate} - Hora: ${formattedTime}`, 50, 30, { align: 'left' });
                doc.text(`Página ${pageNumber}`, 500, 30, { align: 'right' });
                doc.fontSize(16).text('Relatório de Vendedores', 50, 60, { width: 500, align: 'center' });
                doc.moveTo(50, 90).lineTo(550, 90).stroke();
            };

            addHeader();

            const startX = 50;
            const col2X = 300;
            const endX = 550;
            let currentY = 110;

            doc.fontSize(12).text('Nome do Vendedor', startX, currentY)
                           .text('Total de Vendas Finalizadas', col2X, currentY, { align: 'center', width: endX - col2X });
            doc.moveTo(startX, currentY + 15).lineTo(endX, currentY + 15).stroke();
            currentY += 25;

            data.forEach(item => {
                if (currentY > 700) {
                    doc.addPage();
                    pageNumber++;
                    addHeader();
                    currentY = 110;
                }
                doc.text(item.nomeVendedor, startX, currentY);
                doc.text(item.dataValues.totalVendas.toString(), col2X, currentY, { align: 'center', width: endX - col2X });
                currentY += 20;
            });

            doc.end();
        } else {
            res.status(404).json({ error: 'Nenhum vendedor encontrado' });
        }
    } catch (error) {
        console.error('Erro ao gerar o PDF:', error);
        res.status(500).json({ error: 'Erro ao buscar os vendedores' });
    }
};

// Consumidor que mais comprou
exports.getTopConsumers = async (req, res) => {
    try {
        const data = await Model.findAll({
            attributes: [
                'nomeCliente',
                [sequelize.fn('COUNT', sequelize.col('nomeCliente')), 'totalCompras']
            ],
            group: ['nomeCliente'],
            order: [[sequelize.literal('totalCompras'), 'DESC']]
        });

        if (data.length > 0) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ error: 'Nenhuma compra encontrada' });
        }
    } catch (error) {
        console.error('Erro ao buscar os consumidores com mais compras:', error);
        res.status(500).json({ error: 'Erro ao buscar os consumidores com mais compras:' });
    }
};

// Gera um PDF com os consumidores que mais compraram
exports.generateTopConsumersPDF = async (req, res) => {
    try {
        const data = await Model.findAll({
            attributes: [
                'nomeCliente',
                [sequelize.fn('COUNT', sequelize.col('nomeCliente')), 'totalCompras']
            ],
            group: ['nomeCliente'],
            order: [[sequelize.literal('totalCompras'), 'DESC']]
        });

        if (data.length > 0) {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            let buffers = [];
            let pageNumber = 1;
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString();
            const formattedTime = currentDate.toLocaleTimeString();

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                let pdfData = Buffer.concat(buffers);
                res.writeHead(200, {
                    'Content-Length': Buffer.byteLength(pdfData),
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment;filename=relatorio-top-consumers.pdf',
                }).end(pdfData);
            });

            const addHeader = () => {
                doc.fontSize(10).text(`Data: ${formattedDate} - Hora: ${formattedTime}`, 50, 30, { align: 'left' });
                doc.text(`Página ${pageNumber}`, 500, 30, { align: 'right' });
                doc.fontSize(16).text('Relatório de Consumidores', 50, 60, { width: 500, align: 'center' });
                doc.moveTo(50, 90).lineTo(550, 90).stroke();
            };

            addHeader();

            const startX = 50;
            const col2X = 300;
            const endX = 550;
            let currentY = 110;

            doc.fontSize(12).text('Nome do Consumidor', startX, currentY)
                           .text('Total de Compras Finalizadas', col2X, currentY, { align: 'center', width: endX - col2X });
            doc.moveTo(startX, currentY + 15).lineTo(endX, currentY + 15).stroke();
            currentY += 25;

            data.forEach(item => {
                if (currentY > 700) {
                    doc.addPage();
                    pageNumber++;
                    addHeader();
                    currentY = 110;
                }
                doc.text(item.nomeCliente, startX, currentY);
                doc.text(item.dataValues.totalCompras.toString(), col2X, currentY, { align: 'center', width: endX - col2X });
                currentY += 20;
            });

            doc.end();
        } else {
            res.status(404).json({ error: 'Nenhum consumidor encontrado' });
        }
    } catch (error) {
        console.error('Erro ao gerar o PDF:', error);
        res.status(500).json({ error: 'Erro ao buscar os consumidores' });
    }
};