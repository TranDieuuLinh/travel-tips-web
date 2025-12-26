import { defineType, defineField } from "sanity";

export const post = defineType({
    name:'post',
    title:'Post',
    type:'document',
    fields: [
        defineField({
            name:'countryName',
            title: 'Country Name',
            type: 'reference',
            to:[{type:'country'}]
        }), 
        defineField({
            name: 'postTitle',
            title: 'Post Title',
            type:'string'
        }), 
        defineField({
            name: 'content',
            title: 'Content',
            type:'array',
            of: [{type:'block'},
                {type:'image'}
            ]
        }),
        defineField({
            name:'slug',
            title:'slug',
            type:'slug',
            options:{
                source:'postTitle',
                maxLength:96
            }
        })
    ]
})