import React from 'react'
import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDownIcon } from '@radix-ui/react-icons'

export const Sidebar: React.FC<any> = ({ editor }) => {
	return <aside className={'fixed top-0 right-0 z-40 w-128 h-screen'} aria-label="Sidebar">
		<div className={'h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800'}>
			<Accordion.Root className={'AccordionRoot'} type="multiple" defaultValue={['item-1', 'item-2', 'item-3']}>
				<Accordion.Item className={'AccordionItem'} value="item-1">
					<AccordionTrigger>Grammarly</AccordionTrigger>
					<AccordionContent>
						TODO: use some model to check grammar
					</AccordionContent>
				</Accordion.Item>

				<Accordion.Item className={'AccordionItem'} value="item-2">
					<AccordionTrigger>Text Prediction</AccordionTrigger>
					<AccordionContent>
						TODO: use <a href="https://github.com/unit-mesh/edge-infer">EdgeInference</a> to predict text
					</AccordionContent>
				</Accordion.Item>

				<Accordion.Item className={'AccordionItem'} value="item-3">
					<AccordionTrigger>Similarity</AccordionTrigger>
					<Accordion.Content className={'AccordionContent'}>
						<div className={'AccordionContentText'}>
							TODO: use <a href="https://github.com/unit-mesh/edge-infer">EdgeInference</a> to calculate similarity
						</div>
					</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
		</div>
	</aside>
}

const AccordionTrigger: React.FC<any> = React.forwardRef(({ children, className, ...props }, forwardedRef) => (
	<Accordion.Header className="AccordionHeader">
		<Accordion.Trigger
			className={'AccordionTrigger'}
			{...props}
			ref={forwardedRef}
		>
			{children}
			<ChevronDownIcon className="AccordionChevron" aria-hidden/>
		</Accordion.Trigger>
	</Accordion.Header>
))

const AccordionContent: React.FC<any> = React.forwardRef(({ children, className, ...props }, forwardedRef) => (
	<Accordion.Content
		className={'AccordionContent'}
		{...props}
		ref={forwardedRef}
	>
		<div className="AccordionContentText">{children}</div>
	</Accordion.Content>
))