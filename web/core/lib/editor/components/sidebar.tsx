import React from 'react'
import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDownIcon } from '@radix-ui/react-icons'


import { useTranslation } from "react-i18next";

import { Slider } from './base/slider'
import { 
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
 } from './base/select';

export const Sidebar: React.FC<any> = ({ editor }) => {
	const { t } = useTranslation();

	return <aside className={'z-40 w-96 h-screen'} aria-label="Sidebar">
		<div className={'h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800'}>
			<Accordion.Root className={'accordion-root'} type="multiple" defaultValue={['similar', 'bg-context']}>
				<Accordion.Item className={'accordion-item'} value="item-6">
					<AccordionTrigger>{t('Custom Related Resource Link')}</AccordionTrigger>
					<AccordionContent>
						<input className={'w-full bg-white'}/>
					</AccordionContent>
				</Accordion.Item>

				<Accordion.Item className={'accordion-item'} value="bg-context">
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

				<Accordion.Item className={'accordion-item'} value="item-1">
					<AccordionTrigger>{t('Grammarly')}</AccordionTrigger>
					<AccordionContent>
						TODO: use some model to check grammar
					</AccordionContent>
				</Accordion.Item>

				<Accordion.Item className={'accordion-item'} value="item-2">
					<AccordionTrigger>{t('Text Prediction')}</AccordionTrigger>
					<AccordionContent>
						TODO: use <a href="https://github.com/unit-mesh/edge-infer">EdgeInference</a> to predict text
					</AccordionContent>
				</Accordion.Item>

				<Accordion.Item className={'accordion-item'} value="similar">
					<AccordionTrigger>{t('Text Similarity')}</AccordionTrigger>
					<Accordion.Content className={'accordion-content'}>
						<div className={'AccordionContentText'}>
							TODO: use <a href="https://github.com/unit-mesh/edge-infer">EdgeInference</a> to calculate similarity
						</div>
					</Accordion.Content>
				</Accordion.Item>

				<Accordion.Item className={'accordion-item'} value="item-4">
					<AccordionTrigger>{t('Web Search')}</AccordionTrigger>
					<Accordion.Content className={'accordion-content'}>
						<div className={'AccordionContentText'}>
							TODO
						</div>
					</Accordion.Content>
				</Accordion.Item>

				<Accordion.Item className={'accordion-item'} value="model-setting">
					<AccordionTrigger>{t('Model Setting')}</AccordionTrigger>
					<Accordion.Content className={'accordion-content'}>
						<div className="py-4 px-5">
							<div className="grid gap-2 pt-2">
								<div className="flex items-center justify-between">
									<label htmlFor="model">Model</label>
									<span className="w-[200px] rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
									gpt-3.5-turbo
									</span>
								</div>
									
								<Select >
									<SelectTrigger className="w-full box-border">
										<SelectValue placeholder="Select a model..." />
									</SelectTrigger>
									<SelectContent className="bg-white">
										<SelectGroup>
										<SelectLabel>Open AI</SelectLabel>
										<SelectItem value="gpt-3.5-turbo">gpt-3.5-turbo</SelectItem>
										<SelectItem value="gpt-3.5-turbo-16k">gpt-3.5-turbo-16k</SelectItem>
										<SelectItem value="gpt-4">gpt-4</SelectItem>
										<SelectItem value="gpt-4-32k">gpt-4-32k</SelectItem>
										
										<SelectLabel>文心一言</SelectLabel>
										<SelectItem value="ernie-bot">ernie-bot</SelectItem>
										<SelectItem value="ernie-bot-turbo">ernie-bot-turbo</SelectItem>
										<SelectItem value="ernie-bot-4">ernie-bot-4</SelectItem>
										<SelectItem value="ernie-bot-8k">ernie-bot-8k</SelectItem>

										<SelectLabel>通义千问</SelectLabel>
										<SelectItem value="qwen-turbo">qwen-turbo</SelectItem>
										<SelectItem value="qwen-plus">qwen-plus</SelectItem>
										<SelectItem value="qwen-max">qwen-max</SelectItem>
										<SelectItem value="qwen-max-longcontext">qwen-max-longcontext</SelectItem>

										<SelectLabel>Minimax</SelectLabel>
										<SelectItem value="abab5-chat">abab5-chat</SelectItem>
										<SelectItem value="abab5.5-chat">abab5.5-chat</SelectItem>
										<SelectItem value="abab5.5-chat-pro">abab5.5-chat-pro</SelectItem>
										
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>
							
							<div className="grid gap-2 pt-2">
								<div className="grid gap-4">
									<div className="flex items-center justify-between">
										<label htmlFor="temperature">Temperature</label>
										<span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
											0.56
										</span>
									</div>
									<Slider
										id="temperature"
										max={1}
										defaultValue={[0.56]}
										step={0.1}
										className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
										aria-label="Temperature"
									/>
								</div>
							</div>

							<div className="grid gap-2 pt-2">
								<div className="grid gap-4">
									<div className="flex items-center justify-between">
										<label htmlFor="maxlength">Maximum Length</label>
										<span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
										256
										</span>
									</div>
									<Slider
										id="maxlength"
										max={4000}
										defaultValue={[256]}
										step={10}
										className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
										aria-label="Maximum Length"
									/>
								</div>
							</div>

							<div className="grid gap-2 pt-2">
								<div className="grid gap-4">
									<div className="flex items-center justify-between">
										<label htmlFor="top-p">Top P</label>
										<span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
											0.9
										</span>
									</div>
									<Slider
										id="top-p"
										max={1}
										defaultValue={[0.9]}
										step={0.1}
										className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
										aria-label="top-p"
									/>
								</div>
							</div>

							<div className="grid gap-2 pt-2">
								<div className="grid gap-4">
									<div className="flex items-center justify-between">
										<label htmlFor="presence-penalty">Presence penalty</label>
										<span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
											0
										</span>
									</div>
									<Slider
										id="presence-penalty"
										max={1}
										defaultValue={[0]}
										step={0.1}
										className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
										aria-label="presence-penalty"
										/>
									</div>
							</div>
						</div>
					</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
		</div>
	</aside>
}

const AccordionTrigger: React.FC<any> = React.forwardRef(({ children, className, ...props }, forwardedRef) => (
	<Accordion.Header className="accordion-header">
		<Accordion.Trigger
			className={'accordion-trigger'}
			{...props}
			ref={forwardedRef}
		>
			{children}
			<ChevronDownIcon className="accordion-chevron" aria-hidden/>
		</Accordion.Trigger>
	</Accordion.Header>
))

const AccordionContent: React.FC<any> = React.forwardRef(({ children, className, ...props }, forwardedRef) => (
	<Accordion.Content
		className={'accordion-content'}
		{...props}
		ref={forwardedRef}
	>
		<div className="AccordionContentText">{children}</div>
	</Accordion.Content>
))