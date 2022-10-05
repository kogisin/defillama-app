import Layout from '~/layout'
import YieldPageOptimizer from '~/components/YieldsPage/indexOptimizer'
import { revalidate } from '~/api'
import { getLendBorrowData } from '~/api/categories/yield'
import pako from 'pako'

export async function getStaticProps() {
	const data = await getLendBorrowData()

	const strData = JSON.stringify(data)

	const a = pako.deflate(strData)
	const compressed = Buffer.from(a).toString('base64')

	return {
		props: { compressed },
		revalidate: revalidate(23)
	}
}

export default function YieldBorrow(compressedProps) {
	const b = new Uint8Array(Buffer.from(compressedProps.compressed, 'base64'))
	const data = JSON.parse(pako.inflate(b, { to: 'string' }))
	return (
		<Layout title={`Lend/Borrow optimizer - DefiLlama Yield`} defaultSEO>
			<YieldPageOptimizer {...data.props} />
		</Layout>
	)
}
