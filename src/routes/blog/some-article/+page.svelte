<script lang="ts">
	import { BlogPost } from '$lib/index.js';
</script>

<BlogPost
	title="Some Article"
	subtitle="This is a blog post about something."
	content={`<p>In this comprehensive blog post, we'll explore the fascinating world of modern web development.</p>

<p>First, we'll dive deep into the fundamentals of building responsive user interfaces. Understanding these core concepts is crucial for creating engaging web experiences.</p>

<p>Next, we'll examine best practices for state management and component architecture. These principles form the backbone of maintainable applications.</p>

<p>Finally, we'll look at performance optimization techniques that can significantly improve your application's speed and user experience.</p>

<p>Throughout this article, we'll use practical examples and real-world scenarios to illustrate these concepts effectively.</p>`}
	keywords={['blog', 'post', 'article']}
	thumbnail={{
		src: 'https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
		alt: 'img'
	}}
	href="/blog/some-article"
	datePublished={new Date(2021, 0, 1)}
/>
