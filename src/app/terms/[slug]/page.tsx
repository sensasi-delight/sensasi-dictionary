let CONTENT_LINES: string[]
const TERMS_PATH = `${process.cwd()}/../`

import type { Metadata, ResolvingMetadata } from 'next'

import fs from 'fs'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import reactMarkdownComponents from '@/components/reactMarkdownComponents'

import clearMdSyntax from '@/utils/clearMdSyntax'
import getBasePath from '@/utils/getBasePath'
import getTermPaths from '@/utils/getTermPaths'

type Props = {
    params: { slug: string }
}

export async function generateStaticParams() {
    return getTermPaths().map((path: string) => ({
        slug: path,
    }))
}

export default function TermPage({ params }: Props) {
    const slug = params.slug.toLocaleLowerCase()

    const markdown_content = fs.readFileSync(
        `${TERMS_PATH}/${slug.charAt(0)}/${slug}.md`,
        'utf8',
    )

    CONTENT_LINES = markdown_content.split('\n')

    return (
        <article>
            <ReactMarkdown
                remarkPlugins={[[remarkGfm]]}
                components={reactMarkdownComponents}>
                {markdown_content}
            </ReactMarkdown>
        </article>
    )
}

export async function generateMetadata(
    { params: { slug } }: Props,
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const parentMetadata = await parent

    const titleContent = clearMdSyntax(
        CONTENT_LINES.find(line => line.startsWith('# '))?.slice(2),
    )

    const title = `${titleContent} — ${parentMetadata.title?.absolute}`
    const description =
        clearMdSyntax(
            CONTENT_LINES.find(line => line.startsWith('1. '))?.slice(7),
        ) ||
        parentMetadata.description ||
        undefined

    return {
        title: title,
        description: description,
        openGraph: {
            ...parentMetadata.openGraph,
            url: `${getBasePath() ?? ''}/terms/${slug}`,
            title: title,
            description: description,
        },
        twitter: {
            title: title,
            description: description,
            images: parentMetadata.twitter?.images,
        },
    }
}
