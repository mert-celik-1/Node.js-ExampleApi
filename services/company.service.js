const Company = require('../models/company.model')
const companyDal = require('../dal/index')
const companyDto = require('../dto/company.dto')
const fileService = require('./file.service')
const utils = require('../utils/index')
const personDal = require('../dal/person.dal')
const titleDal = require('../dal/title.dal')
exports.createCompany = async(req) => {
    try {

        const { name, year, description } = req.body
        const company = new Company({
            name,
            year,
            description,
            logo: ''
        })
        const json = await companyDal.company.create(company)
        return {...companyDto, name: json.name, year: json.year, logo: json.logo, description: json.description, id: json._id, createdAt: json.createdAt, updatedAt: json.updatedAt }
    } catch (error) {
        throw new Error(error)
    }
}

exports.updateCompany = async(req) => {
    try {
        const { name, year, description } = req.body
        const { id } = req.params
        const json = await companyDal.company.updateById(id, { name, year, description })
        return {...companyDto, name, year, logo: json.logo, description, id: json._id, createdAt: json.createdAt, updatedAt: json.updatedAt }
    } catch (error) {
        throw new Error(error)
    }
}
exports.uploadLogo = async(req, res) => {
    try {
        const { id } = req.query
        const str = await fileService.uploadImage(req, res)
        const json = await companyDal.company.updateById(id, { logo: str })
        return {...companyDto, name: json.name, year: json.year, logo: str, description: json.description, id: json._id, createdAt: json.createdAt, updatedAt: json.updatedAt }
    } catch (error) {
        throw new Error(error)
    }
}
exports.updateLogo = async(req, res) => {
    try {
        const { id } = req.query
        const str = await fileService.uploadImage(req, res)
        const findedCompany = await companyDal.company.findById(id)
        const isDeleted = utils.helpers.deleteFromDisk(findedCompany.logo ? findedCompany.logo.split('uploads/')[1] : '')
        if (isDeleted) {
            const json = await companyDal.company.updateById(id, { logo: str })
            return {...companyDto, name: json.name, year: json.year, logo: str, description: json.description, id: json._id, createdAt: json.createdAt, updatedAt: json.updatedAt }
        }
        throw new Error('Dosya Silme İşlemi Hatası')

    } catch (error) {
        throw new Error(error)
    }
}

exports.getPersonsById = async(req) => {
    try {
        const { id } = req.params
        const json = await companyDal.company.findOnePopulate({ _id: id }, {
            path: 'persons',
            select: 'name _id surname tcNumber'
        })
        return json.persons
    } catch (error) {
        throw new Error(error)
    }
}



exports.listCompany = async() => {
    try {
        const json = await companyDal.company.listAll()
        return json
    } catch (error) {
        throw new Error(error)
    }
}
exports.deleteCompanyById = async(req) => {
    try {
        const { id } = req.query
        const findedCompany = await companyDal.company.findById(id)
        const isDeleted = utils.helpers.deleteFromDisk(findedCompany.logo ? findedCompany.logo.split('uploads/')[1] : '')
        if (isDeleted) {
            const persons = await personDal.listAll({ company: id })
            persons.forEach(async(person) => {
                utils.helpers.deleteFromDisk(person.cvFile ? person.avatar.split('uploads/')[1] : '')
                utils.helpers.deleteFromDisk(person.avatar ? person.avatar.split('uploads/')[1] : '')
                const findedTitle = await titleDal.findById(person.title)
                const newPersonsForTitle = findedTitle.persons.filter((item) => item.toString() !== findedPerson._id.toString())
                await titleDal.updateById(findedTitle._id, { persons: newPersonsForTitle })
            })
            await personDal.deleteMultiple({ company: id })
            const json = await companyDal.company.deleteById(id)
            return {...companyDto, name: json.name, year: json.year, logo: json.logo, description: json.description, id: json._id, createdAt: json.createdAt, updatedAt: json.updatedAt }
        }
        throw new Error('Dosya Silme İşlemi Hatası')

    } catch (error) {
        throw new Error(error)
    }
}

exports.findCompanyById = async(req) => {
    try {
        const { id } = req.params
        const json = await companyDal.company.findById(id)
        return {...companyDto, name: json.name, year: json.year, logo: json.logo, description: json.description, id: json._id, createdAt: json.createdAt, updatedAt: json.updatedAt }
    } catch (error) {
        throw new Error(error)
    }
}