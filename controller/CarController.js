const { Car } = require('../models')

exports.getCars = async (req, res) => {
    try {
        const users = await Car.findAll({
            attributes: ["id", "nama", "harga", "ukuran", "isDeleted", "createdBy", "updatedBy"],
            order: [['id', 'ASC']],
            where: {
                isDeleted: 0
            }
        });
        res.status(200).json({
            success: true,
            message: "List All Cars",
            data: users,
        });
    } catch (error) {
        console.log(error);
    }
}

exports.getDeletedCars = async (req, res) => {
    try {
        const users = await Car.findAll({
            attributes: ["id", "nama", "harga", "ukuran", "isDeleted", "createdBy", "updatedBy", "deletedBy"],
            order: [['id', 'ASC']],
            where: {
                isDeleted: 1
            }
        });
        res.status(200).json({
            success: true,
            message: "List All Cars",
            data: users,
        });
    } catch (error) {
        console.log(error);
    }
}

exports.addCars = async (req, res) => {
    try {
        const { nama, harga, ukuran } = req.body;

        // const isExisting = await Car.findOne({
        //     where: { nama }
        // })
        // if (isExisting && isDeleted === 0) {
        //     return res.status(409).json({
        //         status: false,
        //         msg: 'Car already exists'
        //     })
        // }

        const created_by = req.user.userId
        console.log(created_by)
        const car = await Car.create({
            nama: nama,
            harga: harga,
            ukuran: ukuran,
            isDeleted: 0,
            createdBy: created_by,
        })
        res.status(201).json({
            status: true,
            message: 'Data added successfully'
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Internal Server Error'
        })
        console.log(error);
    }
}

exports.editCar = async (req, res) => {
    try {
        const { id } = req.params
        const { nama, harga, ukuran } = req.body;

        const car = await Car.findByPk(id)

        if (!car) {
            return res.status(404).json({
                status: false,
                message: 'Data not found'
            })
        }

        const updated_by = req.user.userId
        car.nama = nama,
            car.harga = harga,
            car.ukuran = ukuran
        car.updatedBy = updated_by
        await car.save()

        res.status(201).json({
            status: true,
            message: 'Update data successfully'
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Internal Server Error'
        })
        console.log(error);
    }
}

exports.deleteCar = async (req, res) => {
    try {
        const car = await Car.findOne({
            where: {
                id: req.params.id
            }
        })

        if (!car) {
            return res.status(404).json({
                status: false,
                message: 'Data not found'
            })
        }

        const deletedBy = req.user.userId
        car.deletedBy = deletedBy,
            car.isDeleted = 1
        await car.save()

        res.status(202).json({
            status: true,
            message: 'Delete data successfully'
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Internal Server Error'
        })
        console.log(error);
    }
}

