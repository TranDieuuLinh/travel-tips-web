import { defineField,defineType } from "sanity";

export const who = defineType({
    name:'who',
    title:'Who Are We',
    type:'document', 
    fields:[
        defineField({
            name:'whoTitle',
            title: 'Who Title',
            type: 'string',
        }), 
        defineField({
            name: 'whoContent',
            title: 'Who Content',
            type: 'array',
            of: [{ type: 'block' }],
        }), 
    ]
})