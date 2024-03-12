const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const { app } = require("../config");

exports.create = async(req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name cannot be empty"));
    }
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.create(req.body);
        return res.send(document);
    } catch (error) {
        console.error("Error creating contact:", error);
        return next(new ApiError(500, "An error occurred while creating the contact"));
    }
};

exports.findAll = async(req, res, next) => {
    let documents = [];
    try {
        const contactService = new ContactService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await contactService.findByName(name);
        } else {
            documents = await contactService.find({});
        }
        return res.send(documents);
    } catch (error) {
        console.error("Error finding contacts:", error);
        return next(new ApiError(500, "An error occurred while retrieving contacts"));
    }
};

exports.findOne = async(req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send(document);
    } catch (error) {
        console.error("Error finding contact:", error);
        return next(new ApiError(500, "An error occurred while retrieving the contact"));
    }
};

exports.update = async(req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update cannot be empty"));
    }
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({ message: "Contact was updated successfully" });
    } catch (error) {
        console.error("Error updating contact:", error);
        return next(new ApiError(500, `Error updating contact with id=${req.params.id}`));
    }
};

exports.delete = async(req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({ message: "Contact deleted successfully" });
    } catch (error) {
        console.error("Error deleting contact:", error);
        return next(new ApiError(500, `Could not delete contact with ${req.params.id}`));
    }
};

exports.findAllFavorite = async(_req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findFavorite();
        return res.send(document);
    } catch (error) {
        console.error("Error finding favorite contacts:", error);
        return next(new ApiError(500, "An error occurred while retrieving favorite contacts"));
    }
};

exports.deleteAll = async(_req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const deletedCount = await contactService.deleteAll();
        return res.send({
            message: `${deletedCount} contacts were deleted successfully`,
        });
    } catch (error) {
        console.error("Error deleting all contacts:", error);
        return next(new ApiError(500, "An error occurred while removing all contacts"));
    }
};