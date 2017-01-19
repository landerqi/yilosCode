const http = require('http');
const Promise = require('bluebird');
const cheerio = require('cheerio');
const fs = require('fs');

const baseUrl = 'http://www.imooc.com/learn/';
const url = 'http://www.imooc.com/learn/348';

const videoIds = [348, 259, 197, 134, 75];

function filterChapters(html) {
	let $ = cheerio.load(html);
	let chapters = $('.chapter');
	let title = $('.course-infos h2').text();
	let number = parseInt($('.js-learn-num').text(), 10);

	let courseData = {
		title: title,
		number: number,
		videos: []
	};
		//console.log(chapters);

	chapters.each(function(t) {
		let chapter = $(this);
		let chapterTitle = chapter.find('strong').text().trim();
		let videos = chapter.find('.video').children('li');
		let chapterData = {
			chapterTitle: chapterTitle,
			videos: []
		}

		videos.each(function(t) {
			let video = $(this).find('.J-media-item');
			let videoTitle = video.text().trim();
			let id = video.attr('href').split('video/')[1];

			chapterData.videos.push({
				title: videoTitle,
				id: id
			})
		})

		courseData.videos.push(chapterData);
	})

	return courseData;
}

function printCourseInfo(coursesData) {
	coursesData.forEach((courseData) => {
		console.log(courseData.number + ' 人学过' + courseData.title + '\n');
	})

	coursesData.forEach((courseData) => {
		console.log('###' + courseData.title + '\n');
		courseData.videos.forEach((t) => {
			let chapterTitle = t.chapterTitle;
			console.log(chapterTitle.trim() + '\n');

			t.videos.forEach((video) => {
				console.log(' [' + video.id + ']' + video.title.trim() + '\n');
			});
		})

	})

	let outputFileName = 'data.json';
	fs.writeFile(outputFileName, JSON.stringify(coursesData, null, 4), function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log('JSON saved to ' + outputFileName);
		}
	})
}


function getPageAsync(url) {
	return new Promise(function(resolve, reject) {
		console.log('正在爬取' + url);
		http.get(url, function(res) {
			let html = '';

			res.on('data', function(data) {
				html += data;
			})

			res.on('end', function() {
				return resolve(html);

			})
		}).on('error', function(e) {
			return reject(e);
			console.log('获取数据出错');
		})
	})
}

let fetchCourseArray = [];
videoIds.forEach((id) => {
	fetchCourseArray.push(getPageAsync(baseUrl + id));
})

Promise
	.all(fetchCourseArray)
	.then(function(pages) {
		let coursesData = [];

		pages.forEach((html) => {
			let course = filterChapters(html);

			coursesData.push(course);
		})

		coursesData.sort(function(a, b) {
			return a.number < b.number
		})

		printCourseInfo(coursesData);
	})

