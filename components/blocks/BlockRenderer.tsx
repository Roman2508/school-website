import MediaBlock from './MediaBlock'
import RichTextBlock from './RichTextBlock'
import AccordionBlock from './AccordionBlock'
import ButtonLinkBlock from './ButtonLinkBlock'
import type { DynamicBlock } from '@/types/strapi'

interface Props {
  block: DynamicBlock
  index?: number
}

export default function BlockRenderer({ block, index = 0 }: Props) {
  switch (block.__component) {
    case 'shared.rich-text':
      return <RichTextBlock block={block} index={index} />
    case 'shared.button-link':
      return <ButtonLinkBlock block={block} index={index} />
    case 'shared.media':
      return <MediaBlock block={block} index={index} />
    case 'shared.accordion':
      return <AccordionBlock block={block} index={index} />
    default:
      return null
  }
}
