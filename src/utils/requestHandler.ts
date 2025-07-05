import { Request } from 'express';

const collectPaginationRequestData = (req: Request) => {
    const { page, limit } = req.query;

    return { page: parseInt(page as string), limit: parseInt(limit as string) };
};

const collectRangeSelectorRequestData = (req: Request) => {
    const { from, till } = req.query;

    return { from: from as string, till: till as string };
};

const collectCurrentEmail = (req) => {
    const { email } = req.subject;

    return email;
};

export default {
    collectPaginationRequestData,
    collectRangeSelectorRequestData,
    collectCurrentEmail,
};
