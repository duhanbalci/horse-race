import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import Accordion from '../components/ui/Accordion.vue'

describe('Accordion Component', () => {
  let wrapper: VueWrapper<any>

  const mockItems = [
    { title: 'Item 1', content: 'Content 1' },
    { title: 'Item 2', content: 'Content 2' },
    { title: 'Item 3', content: 'Content 3' },
  ]

  const createWrapper = (props = {}, slots = {}) => {
    return mount(Accordion, {
      props: {
        items: mockItems,
        ...props,
      },
      slots,
    })
  }

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  describe('Basic Rendering', () => {
    beforeEach(() => {
      wrapper = createWrapper()
    })

    it('should render the accordion component', () => {
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.space-y-2').exists()).toBe(true)
    })

    it('should render all items', () => {
      const items = wrapper.findAll('.overflow-hidden')
      expect(items).toHaveLength(3)
    })

    it('should display item titles', () => {
      expect(wrapper.text()).toContain('Item 1')
      expect(wrapper.text()).toContain('Item 2')
      expect(wrapper.text()).toContain('Item 3')
    })
  })
})
