//0; // user, browser, OS?
// On page load or when changing themes, best to add inline in `head` to avoid FOUC

// let $ = (selector) => {
//   let els = [...document.querySelectorAll(selector)];
//   console.log(els, selector);
//   return {
//     css: (propertyName, value) => {
//       els.forEach((el) => {
//         el.style[propertyName] = value;
//       });
//     },
//     hide: () => {
//       els.forEach((el) => {
//         el.style['display'] = 'none';
//       });
//     },
//     show: () => {
//       els.forEach((el) => {
//         el.style['display'] = 'inline';
//       });
//     },
//     html: (text) => {
//       els.forEach((el) => {
//         el.innerHTML = text;
//       });
//     },
//     clear: () => {
//       els.forEach((el) => {
//         el.value = '';
//       });
//     },
//     append: (element) => {
//       els.forEach((el) => {
//         var option = document.createElement('option');
//         option.setAttribute('value', element.display);
//         option.text = element.display;
//         el.add(option);
//       });
//     },
//     remove: (index) => {
//       els[0].remove(index);
//     },
//     length: () => {
//       return els[0].options.length;
//     },
//     val: () => {
//       return els[0].value;
//     },
//     toggle: (add, remove) => {
//       els[0].classList.remove(`bg-${remove}-500`);
//       els[0].classList.remove(`hover:bg-${remove}-700`);
//       els[0].classList.add(`bg-${add}-500`);
//       els[0].classList.add(`hover:bg-${add}-700`);
//     },
//   };
// };
//const $ = require('jquery');
$('document').ready(function () {
  $('textarea').each(function () {
    $(this).val($(this).val().trim());
  });
});
// api url
const api_url =
  'https://jsonserverny4cxf-1gn2--3000.local-credentialless.webcontainer.io/api/v1/courses';
const logs_url =
  'https://jsonserverny4cxf-1gn2--3000.local-credentialless.webcontainer.io/api/v1/logs';

var logDisplay = $('#uvuDisplayLogs');
var textBox = $('#uvuId');
var submitButton = $('#submitButton');
var uvuIdDisplay = $('#uvuIdDisplay');
var uvuTitle = $('#uvuIdTitleAndInput');
var prompt = $('#inputPrompt');

// Defining async function
async function getapi(url) {
  const response = await axios({
    method: 'get',
    url: url,
    withCredentials: false,
  });
  populateOptions(response.data);
}

function populateOptions(data) {
  var selector = $('#course');
  selector.empty();
  var option = $('<option>', {
    value: 'ChooseCourses',
    text: 'Choose Courses',
  });
  selector.append(option);
  for (var i = 0; i < data.length; i++) {
    option = $('<option>', { value: data[i], text: data[i] });
    selector.append(option);
  }
}

function hideInputBox() {
  var prompt = $('#inputPrompt');
  var x = $('#course').val();
  if (x == 'ChooseCourses') {
    prompt.html('');
    logDisplay.html('');
    uvuTitle.hide();
  } else {
    uvuTitle.show();
  }
}

async function getLogsFromId(courseId, uvuId) {
  // var url =
  //   'https://jsonserverny4cxf-1gn2--3000.local-credentialless.webcontainer.io/logs?courseId=' +
  //   courseId +
  //   '&uvuId=' +
  //   uvuId;
  var url =
    'https://jsonserversjfasv-ritb--3000.local-credentialless.webcontainer.io/api/v1/logs/10111111';

  const response = await axios({
    method: 'get',
    url: url,
    withCredentials: false,
  });
  console.log(response);
  changeLogsFromId(response.data);
}

function vetInputData() {
  var courseId = $('#course').val().replace(/\s/g, '').toLowerCase();
  var uvuId = $('#uvuId').val();
  var flag = false;
  if (uvuId.length == 8) {
    flag = true;
  } else {
    submitButton.hide();
    prompt.html('ID must be 8 characters and only digits');
  }
  if (flag) {
    getLogsFromId(courseId, uvuId);
    console.log(200);
    prompt.html('');
    submitButton.show();
    flag = false;
  }
}

function changeLogsFromId(data) {
  // remove all children data before populating new

  logDisplay.html('');
  let logText = '';

  for (var i = 0; i < data.length; i++) {
    logText += `
    <li class="mb-5">
        <div class="" id="item${i}" onclick="hideTextOfLogs(this)" ><small>${data[i].date}</small>
          <div>
            <pre><p class="break-normal whitespace-normal	inline">${data[i].text}</p></pre> 
          </div>
        </div>
    </li>
    `;
  }
  logDisplay.html(logText);
}

function toggleButton() {
  var textareaValue = $('#textareaLog').val();
  if (textareaValue == '') {
    $('#submitButton').toggle('gray', 'blue');
  } else {
    $('#submitButton').toggle('blue', 'gray');
  }
}

function hideTextOfLogs(item) {
  var x = item.children[1];
  console.log(x);
  if (x.style.display === 'none') {
    x.style.display = 'inline';
  } else {
    x.style.display = 'none';
  }
}

async function submitNewLog() {
  var courseId = $('#course').val().replace(/\s/g, '').toLowerCase();
  var uvuId = $('#uvuId').val();
  var textArea = $('#textareaLog');
  var value = textArea.val();

  var postObject = {
    courseId: courseId,
    uvuId: uvuId,
    date: new Date().toLocaleString(),
    text: value,
    id: makeId(7),
  };

  textArea.val('');
  //uvuId.clear();
  try {
    const response = await axios.post(logs_url, postObject);
    console.log('Success:', response.data);
    await getLogsFromId(courseId, uvuId);
  } catch (error) {
    console.error('Error:', error);
  }

  //console.log('I RAN ANYWAYS');
}

function makeId(length) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

submitButton.hide();
logDisplay.html('');
uvuIdDisplay.hide();
uvuTitle.hide();
getapi(api_url);
