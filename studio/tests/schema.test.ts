import {describe, expect, it} from 'vitest'
import {readFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {schemaTypes} from '../schemaTypes'

const studioRoot = fileURLToPath(new URL('..', import.meta.url))

function schema(name: string) {
  const match = schemaTypes.find((type) => type.name === name)
  expect(match, `Missing schema: ${name}`).toBeDefined()
  return match!
}

function fieldNames(name: string) {
  const type = schema(name)
  if (!('fields' in type)) return []
  return type.fields.map((field) => field.name)
}

describe('production schema registry', () => {
  it('registers the approved production schema types in stable order', () => {
    expect(schemaTypes.map((type) => type.name)).toEqual([
      'blockContent',
      'siteSettings',
      'profile',
      'homepage',
      'education',
      'experience',
      'capabilityGroup',
      'project',
      'testimonial',
      'socialLink',
      'mediaRecord',
    ])
  })

  it.each([
    ['siteSettings', ['siteTitle', 'siteDescription', 'canonicalUrl', 'socialName', 'allowIndexing', 'defaultShareImage']],
    ['profile', ['name', 'englishName', 'professionalTitle', 'locations', 'timezone', 'availability', 'shortBio', 'fullBio', 'portrait']],
    ['homepage', ['heroTitleLines', 'heroNameLines', 'heroTechChips', 'regionLabel', 'valuePropositionLines', 'availability', 'primaryCtaLabel', 'aboutTitle', 'aboutLabel', 'about', 'aboutPhotos', 'marqueePrimaryLines', 'marqueeSecondaryLines', 'skillTickerItems', 'experienceTitle', 'experienceLabel', 'experienceIntro', 'projectsTitle', 'projectsLabel', 'projectsIntro', 'testimonialsTitle', 'testimonialsIntro', 'contactTitleLines', 'contactInvitation']],
    ['education', ['institution', 'degree', 'fieldOfStudy', 'location', 'startDate', 'endDate', 'isExpected', 'description', 'highlights', 'relatedUrl', 'order', 'isVisible']],
    ['experience', ['company', 'role', 'timeLabel', 'outcomes', 'order', 'isVisible']],
    ['capabilityGroup', ['name', 'items', 'order', 'isVisible']],
    ['project', ['name', 'projectType', 'role', 'summary', 'outcomes', 'capabilities', 'order', 'isVisible']],
    ['testimonial', ['personName', 'personRole', 'company', 'relationship', 'quote', 'date', 'portrait', 'permissionStatus', 'permissionNote', 'order', 'isVisible']],
    ['socialLink', ['platform', 'label', 'url', 'accessibilityLabel', 'order', 'isVisible']],
    ['mediaRecord', ['asset', 'label', 'alt', 'caption', 'source', 'rightsStatus', 'attribution', 'placements', 'originalDimensions', 'targetAspectRatio', 'focalPoint']],
  ])('exposes the approved %s fields', (name, expected) => {
    expect(fieldNames(name as string)).toEqual(expected)
  })

  it('keeps presentation and unapproved project fields out of content schemas', () => {
    const forbidden = new Set(['slug', 'layout', 'component', 'animation', 'video', 'demoUrl'])
    const actual = schemaTypes.flatMap((type) =>
      'fields' in type ? type.fields.map((field) => field.name) : [],
    )
    expect(actual.filter((name) => forbidden.has(name))).toEqual([])
  })

  it('does not allow arbitrary rich-text block styles or annotations', () => {
    const type = schema('blockContent')
    const block = 'of' in type ? type.of[0] : undefined
    expect(block && 'styles' in block ? block.styles?.map((style) => style.value) : []).toEqual([
      'normal',
      'h2',
      'h3',
    ])
    expect(block && 'marks' in block ? Object.keys(block.marks ?? {}) : []).toEqual([
      'decorators',
      'annotations',
    ])
  })

  it('selects the project and dataset through public Studio environment variables', () => {
    const configSource = readFileSync(`${studioRoot}/sanity.config.ts`, 'utf8')
    const cliSource = readFileSync(`${studioRoot}/sanity.cli.ts`, 'utf8')
    expect(configSource).toContain('SANITY_STUDIO_PROJECT_ID')
    expect(configSource).toContain('SANITY_STUDIO_DATASET')
    expect(cliSource).toContain('SANITY_STUDIO_PROJECT_ID')
    expect(cliSource).toContain('SANITY_STUDIO_DATASET')
    expect(configSource).not.toContain("dataset: 'poc'")
    expect(cliSource).not.toContain("dataset: 'poc'")
  })

  it('provides fixed Chinese singleton entries including Homepage', () => {
    const structureSource = readFileSync(`${studioRoot}/structure.ts`, 'utf8')
    expect(structureSource).toContain("S.list()\n    .id('content')")
    expect(structureSource).toContain('S.listItem().id(type)')
    expect(structureSource).toContain("documentId('homepage')")
    expect(structureSource).toContain("title('首页内容')")
  })
})
