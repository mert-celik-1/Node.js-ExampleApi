const Person = require('../models/persons.model')
const personDal = require('../dal/index')
const utils = require('../utils/index')
const personDto = require('../dto/person.dto')
const fileService = require('./file.service')
const personCompanyDto = require('../dto/person.company.dto')
const personTitleDto = require('../dto/person.title.dto')
const titleDal = require('../dal/title.dal')
const companyDal = require('../dal/company.dal')
exports.createPerson = async(req) => {
    try {
        const {
            name,
            surname,
            birthDate,
            gender,
            salary,
            tcNumber,
            email,
            password,
            country,
            city,
            company,
            title
        } = req.body
        const findedTitle = await titleDal.findById(title)
        const findedCompany = await companyDal.findById(company)
        const person = new Person({
            name,
            surname,
            birthDate,
            salary,
            gender,
            tcNumber,
            email,
            password: utils.helpers.hashToPassword(password),
            country,
            city,
            title,
            company,
            avatar: "",
            cvFile: ""
        })
        const json = await personDal.person.create(person)
        findedTitle.persons.push(json._id)
        findedCompany.persons.push(json._id)
        await titleDal.create(findedTitle)
        await companyDal.create(findedCompany)

        return {...personDto,
            name: json.name,
            id: json._id,
            surname: json.surname,
            birthDate: new Date(json.birthDate),
            gender: json.gender,
            salary: new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'YTL' }).format(json.salary),
            tcNumber: json.tcNumber,
            email: json.email,
            country: json.country,
            city: json.city,
            avatar: json.avatar,
            cvFile: json.cvFile,
            title: json.title,
            company: json.company
        }
    } catch (error) {
        throw new Error(error)
    }
}

exports.signIn = async(req) => {
    try {
        const {
            email,
            password,
        } = req.body

        const _password = utils.helpers.hashToPassword(password)
        const json = await personDal.person.findOne({ email, password: _password })
        if (json) {
            const token = utils.helpers.createToken(json._id, json.name + "" + json.surname, json.email)
            return { fullName: json.name + "" + json.surname, id: json._id, email: json.email, token }
        }
        return null

    } catch (error) {
        throw new Error(error)
    }
}

exports.uploadAvatar = async(req, res) => {
    try {
        const { id } = req.query
        const str = await fileService.uploadImage(req, res)
        const json = await personDal.person.updateById(id, { avatar: str })
        return {...personDto,
            name: json.name,
            id: json._id,
            surname: json.surname,
            birthDate: new Date(json.birthDate),
            gender: json.gender,
            salary: new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'YTL' }).format(json.salary),
            tcNumber: json.tcNumber,
            email: json.email,
            country: json.country,
            city: json.city,
            avatar: str,
            cvFile: json.cvFile,
            title: json.title,
            company: json.company
        }
    } catch (error) {
        throw new Error(error)
    }
}

exports.updateAvatar = async(req, res) => {
    try {
        const { id } = req.query
        const str = await fileService.uploadImage(req, res)
        const findedPerson = await personDal.person.findById(id)
        const isDeleted = utils.helpers.deleteFromDisk(findedPerson.avatar ? findedPerson.avatar.cvFile('uploads/')[1] : '')
        if (isDeleted) {
            const json = await personDal.person.updateById(id, { avatar: str })
            return {...personDto,
                name: json.name,
                id: json._id,
                surname: json.surname,
                birthDate: new Date(json.birthDate),
                gender: json.gender,
                salary: new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'YTL' }).format(json.salary),
                tcNumber: json.tcNumber,
                email: json.email,
                country: json.country,
                city: json.city,
                avatar: str,
                cvFile: json.cvFile,
                title: json.title,
                company: json.company,
                createdAt: json.createdAt,
                updatedAt: json.updatedAt
            }
        }
        throw new Error('Dosya Silme İşlemi Hatası')

    } catch (error) {
        throw new Error(error)
    }
}
exports.uploadCv = async(req, res) => {
    try {
        const { id } = req.query
        const str = await fileService.uploadCv(req, res)
        const json = await personDal.person.updateById(id, { cvFile: str })
        return {...personDto,
            name: json.name,
            id: json._id,
            surname: json.surname,
            birthDate: new Date(json.birthDate),
            gender: json.gender,
            salary: new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'YTL' }).format(json.salary),
            tcNumber: json.tcNumber,
            email: json.email,
            country: json.country,
            city: json.city,
            avatar: json.avatar,
            cvFile: str,
            title: json.title,
            company: json.company,
            createdAt: json.createdAt,
            updatedAt: json.updatedAt
        }
    } catch (error) {
        throw new Error(error)
    }
}

exports.updateCv = async(req, res) => {
    try {
        const { id } = req.query
        const str = await fileService.uploadCv(req, res)
        const findedPerson = await personDal.person.findById(id)
        const isDeleted = utils.helpers.deleteFromDisk(findedPerson.cvFile ? findedPerson.cvFile.cvFile('uploads/')[1] : '')
        if (isDeleted) {
            const json = await personDal.person.updateById(id, { cvFile: str })
            return {...personDto,
                name: json.name,
                id: json._id,
                surname: json.surname,
                birthDate: new Date(json.birthDate),
                gender: json.gender,
                salary: new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'YTL' }).format(json.salary),
                tcNumber: json.tcNumber,
                email: json.email,
                country: json.country,
                city: json.city,
                avatar: json.avatar,
                cvFile: str,
                title: json.title,
                company: json.company,
                createdAt: json.createdAt,
                updatedAt: json.updatedAt
            }
        }
        throw new Error('Dosya Silme İşlemi Hatası')

    } catch (error) {
        throw new Error(error)
    }
}

exports.findByEmil = async(email) => {
    try {
        const json = await personDal.person.findOne({ email })
        return json
    } catch (error) {
        throw new Error(error)
    }
}

exports.getCompany = async(req) => {
    try {
        const { id } = req.params
        const json = await personDal.person.findOnePopulate({ _id: id }, {
            path: 'company',
            select: 'company _id year name'
        })
        return {...personCompanyDto, name: json.company.name, year: json.company.year, id: json.company._id }
    } catch (error) {
        throw new Error(error)
    }
}

exports.getTitle = async(req) => {
    try {
        const { id } = req.params
        const json = await personDal.person.findOnePopulate({ _id: id }, {
            path: 'title',
            select: '_id name'
        })
        return {...personTitleDto, id: json.title._id, name: json.title.name }
    } catch (error) {
        throw new Error(error)
    }
}


exports.getPersonById = async(req) => {
    try {
        const { id } = req.params
        const json = await personDal.person.findById(id)
        delete personDto.title
        delete personDto.company
        return {...personDto,
            name: json.name,
            id: json._id,
            surname: json.surname,
            birthDate: new Date(json.birthDate),
            gender: json.gender,
            salary: new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'YTL' }).format(json.salary),
            tcNumber: json.tcNumber,
            email: json.email,
            country: json.country,
            city: json.city,
            avatar: json.avatar,
            cvFile: json.cvFile,
            createdAt: json.createdAt,
            updatedAt: json.updatedAt
        }
    } catch (error) {
        throw new Error(error)
    }
}

exports.listPersons = async() => {
    try {
        const json = await personDal.person.listAll({}, [{
                path: 'company',
                select: 'company _id year name',
            },
            {
                path: 'title',
                select: '_id name'
            }
        ])
        return json
    } catch (error) {
        throw new Error(error)
    }
}
exports.listPersonsWithPagination = async(req) => {
    try {
        const { perPage, page, sortBy, sortDirection } = req.query
        const json = await personDal.person.listAllWithPagination({}, [{
                path: 'company',
                select: 'company _id year name',
            },
            {
                path: 'title',
                select: '_id name'
            }
        ], perPage, perPage * page, {
            [sortBy]: sortDirection
        })
        return json
    } catch (error) {
        throw new Error(error)
    }
}

exports.updatePerson = async(req) => {
    try {
        const {
            name,
            surname,
            birthDate,
            gender,
            salary,
            tcNumber,
            email,
            password,
            country,
            city,
            company,
            title
        } = req.body
        const { id } = req.params
        const json = await personDal.person.updateById(id, {
            name,
            surname,
            birthDate,
            gender,
            salary,
            tcNumber,
            email,
            password: utils.helpers.hashToPassword(password),
            country,
            city,
            company,
            title
        })
        return {...personDto,
            id: json._id,
            name,
            surname,
            birthDate,
            gender,
            salary: new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'YTL' }).format(salary),
            tcNumber,
            email,
            password,
            country,
            city,
            company,
            title,
            avatar: json.avatar,
            cvFile: json.cvFile
        }

    } catch (error) {
        throw new Error(error)
    }
}

exports.deletePersonById = async(req) => {
    try {
        const { id } = req.query
        const findedPerson = await personDal.person.findById(id)
        const isCvDeleted = utils.helpers.deleteFromDisk(findedPerson.cvFile ? findedPerson.avatar.split('uploads/')[1] : '')
        const isAvatarDeleted = utils.helpers.deleteFromDisk(findedPerson.avatar ? findedPerson.avatar.split('uploads/')[1] : '')
        if (isCvDeleted && isAvatarDeleted) {
            const json = await personDal.person.deleteById(id)
            const findedCompany = await companyDal.findById(findedPerson.company)
            const findedTitle = await titleDal.findById(findedPerson.title)
            const newPersonsForCompany = findedCompany.persons.filter((item) => item.toString() !== findedPerson._id.toString())
            const newPersonsForTitle = findedTitle.persons.filter((item) => item.toString() !== findedPerson._id.toString())
            await titleDal.updateById(findedTitle._id, { persons: newPersonsForTitle })
            await companyDal.updateById(findedCompany._id, { persons: newPersonsForCompany })


            return {...personDto,
                name: json.name,
                id: json._id,
                surname: json.surname,
                birthDate: new Date(json.birthDate),
                gender: json.gender,
                salary: new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'YTL' }).format(json.salary),
                tcNumber: json.tcNumber,
                email: json.email,
                country: json.country,
                city: json.city,
                avatar: json.avatar,
                cvFile: json.cvFile,
                createdAt: json.createdAt,
                updatedAt: json.updatedAt
            }
        }
        throw new Error('Dosya Silme İşlemi Hatası')

    } catch (error) {
        throw new Error(error)
    }
}