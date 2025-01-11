// pages/champions/[championId].tsx

import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import React from 'react'
import dbConnect from '@/lib/dbConnect'
import ChampionModel from '@/models/ChampionModel'
import Layout from '@/components/Layout'

interface ChampionDetailProps {
  champion?: {
    id: string
    key: string
    name: string
    title: string
    iconUrl?: string
    stats?: Record<string, any>
    tags?: string[]
  }
}

/**
 * This page uses Server-Side Rendering (SSR) to fetch champion data
 * from the local DB by championId (which might be "Aatrox", "Ahri", etc.).
 * For a static approach, you could use getStaticProps and getStaticPaths instead.
 */
export const getServerSideProps: GetServerSideProps<ChampionDetailProps> = async (context) => {
  const { championId } = context.params as { championId: string }

  await dbConnect()

  // Find champion in DB by "id" field (e.g., "Ahri", "Aatrox", etc.)
  // If you store numeric key (e.g., "266"), adapt accordingly
  const champion = await ChampionModel.findOne({ id: championId }).lean()

  if (!champion) {
    return {
      notFound: true,
    }
  }

  // Convert champion object to plain JS object to avoid Next.js serialization issues
  const championData = JSON.parse(JSON.stringify(champion))

  return {
    props: {
      champion: championData,
    },
  }
}

export default function ChampionDetailPage({
  champion,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!champion) {
    return <p>Champion not found</p>
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-2">{champion.name}</h1>
        <p className="text-xl text-gray-300 mb-4">{champion.title}</p>

        {/* Champion Icon */}
        {champion.iconUrl ? (
          <img
            src={champion.iconUrl}
            alt={champion.name}
            className="h-32 w-32 object-contain mb-4"
          />
        ) : (
          <p>No icon available.</p>
        )}

        {/* Champion Stats */}
        {champion.stats && (
          <div className="bg-gray-800 p-4 rounded-md">
            <h2 className="text-2xl font-semibold mb-2">Base Stats</h2>
            <ul className="list-disc list-inside">
              {Object.entries(champion.stats).map(([statKey, value]) => (
                <li key={statKey} className="text-gray-300">
                  <strong>{statKey}:</strong> {value}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Champion Tags / Roles */}
        {champion.tags && champion.tags.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2">Roles</h3>
            <div className="flex space-x-2">
              {champion.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-600 rounded px-2 py-1 text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
