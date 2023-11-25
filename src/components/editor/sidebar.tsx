import React from 'react'
import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { useTranslation } from "react-i18next";

export const Sidebar: React.FC<any> = ({ editor }) => {
	const { t, i18n } = useTranslation();

	return <aside className={'fixed top-0 right-0 z-40 w-128 h-screen'} aria-label="Sidebar">
		<div className={'h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800'}>
			<Accordion.Root className={'AccordionRoot'} type="multiple" defaultValue={['similar', 'bg-context']}>
				<Accordion.Item className={'AccordionItem'} value="item-6">
					<AccordionTrigger>{t('Custom Related Resource Link')}</AccordionTrigger>
					<AccordionContent>
						<input className={'w-full bg-white'}/>
					</AccordionContent>
				</Accordion.Item>

				<Accordion.Item className={'AccordionItem'} value="bg-context">
					<AccordionTrigger>{t('Article Context')}</AccordionTrigger>
					<AccordionContent>
						<textarea
							rows={4}
							className={"block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border"}
							placeholder={'context about this article'}
							onInput={(e) => {
								// @ts-ignore
								editor.commands?.setContext(e.target.value)
							}}
						/>
					</AccordionContent>
				</Accordion.Item>

				<Accordion.Item className={'AccordionItem'} value="item-1">
					<AccordionTrigger>{t('Grammarly')}</AccordionTrigger>
					<AccordionContent>
						TODO: use some model to check grammar
					</AccordionContent>
				</Accordion.Item>

				<Accordion.Item className={'AccordionItem'} value="item-2">
					<AccordionTrigger>{t('Text Prediction')}</AccordionTrigger>
					<AccordionContent>
						TODO: use <a href="https://github.com/unit-mesh/edge-infer">EdgeInference</a> to predict text
					</AccordionContent>
				</Accordion.Item>

				<Accordion.Item className={'AccordionItem'} value="similar">
					<AccordionTrigger>{t('Text Similarity')}</AccordionTrigger>
					<Accordion.Content className={'AccordionContent'}>
						<div className={'AccordionContentText'}>
							TODO: use <a href="https://github.com/unit-mesh/edge-infer">EdgeInference</a> to calculate similarity
						</div>
					</Accordion.Content>
				</Accordion.Item>

				<Accordion.Item className={'AccordionItem'} value="item-4">
					<AccordionTrigger>{t('Web Search')}</AccordionTrigger>
					<Accordion.Content className={'AccordionContent'}>
						<div className={'AccordionContentText'}>
							TODO
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