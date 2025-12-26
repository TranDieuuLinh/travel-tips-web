import { defineType, defineField } from 'sanity'

export const food = defineType({
  name: 'food',
  title: 'Food',
  type: 'document',
  fields: [
    defineField({
      name: 'foodName',
      title: 'Food Name',
      type: 'string',
    }),
    defineField({
      name: 'foodDesc',
      title: 'A little description',
      type: 'text',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'foodImage',
      title: 'Food Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
})
