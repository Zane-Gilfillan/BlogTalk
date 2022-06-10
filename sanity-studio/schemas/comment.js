export default {
    name: 'comment',
    type: 'document',
    title: 'Comment',
    fields: [
        {
            name: 'name',
            type: 'string',
        },
        {
            title: 'approved',
            name: 'approvied',
            type: 'boolean',
            description: "comments won't show on the site without approval"
        },
        {
            name: 'email',
            type: 'string'
        },
        {
            name: 'comment',
            type: 'text',
        },
        {
            name: 'post',
            type: 'reference',
            to: [{ type: 'post'},]
        },
    ],
};