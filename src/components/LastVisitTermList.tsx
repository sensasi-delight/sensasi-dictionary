'use client'

import { useEffect, useState } from 'react'
import NextLink from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import Link from '@mui/material/Link'

let tempTermSlugs: string[]

export default function LastVisitTermList() {
    const pathname = usePathname()
    const { slug } = useParams()

    const [termSlugs, setTermSlugs] = useState<string[] | undefined>(undefined)

    useEffect(() => {
        const lastVisitedTermPaths = localStorage.getItem(
            'lastVisitedTermPaths',
        )

        tempTermSlugs = lastVisitedTermPaths
            ? JSON.parse(lastVisitedTermPaths)
            : []

        setTermSlugs([...tempTermSlugs])
    }, [])

    useEffect(() => {
        if (
            tempTermSlugs !== undefined &&
            pathname.includes('/terms/') &&
            !tempTermSlugs.includes(slug.toString())
        ) {
            handlePathnameChange()
        }
    }, [pathname])

    const handlePathnameChange = () => {
        tempTermSlugs = [...(tempTermSlugs || [])].slice(0, 4)
        tempTermSlugs.unshift(slug.toString())

        localStorage.setItem(
            'lastVisitedTermPaths',
            JSON.stringify(tempTermSlugs),
        )
        return setTermSlugs(tempTermSlugs)
    }

    return (
        <ul
            style={{
                padding: 0,
                paddingLeft: '1.5rem',
                margin: 0,
            }}>
            {(termSlugs || []).map(slug => (
                <li key={slug}>
                    <Link href={`/terms/${slug}`} component={NextLink}>
                        {slug
                            .split('-')
                            .map(
                                word =>
                                    word.charAt(0).toUpperCase() +
                                    word.slice(1),
                            )
                            .join(' ')}
                    </Link>
                </li>
            ))}
        </ul>
    )
}
