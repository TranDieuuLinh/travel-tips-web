import { defineType, defineField } from "sanity";

export const country = defineType({
    name:'country',
    title: 'Country',
    type:'document',
    fields:[
        defineField({
            name:'countryName',
            title: 'Country Name',
            type:'string'
        })
    ]
})