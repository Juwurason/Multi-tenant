import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import PropTypes from 'prop-types';

const Editor = ({ placeholder, onChange, value }) => {
    const [editorHtml, setEditorHtml] = useState('');
    const [theme, setTheme] = useState('snow');

    const handleChange = (html) => {
        setEditorHtml(html);
    };

    // const handleThemeChange = (newTheme) => {
    //     if (newTheme === 'core') newTheme = null;
    //     setTheme(newTheme);
    // };

    const modules = {
        toolbar: [
            [{ header: '1' }, { header: '2' }, { font: [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
            ],
            ['link', 'image', 'video'],
            ['clean'],
        ],
        clipboard: {
            matchVisual: false,
        },
    };

    const formats = [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
        'video',
    ];

    return (
        <div>
            <ReactQuill
                theme={theme}
                onChange={onChange}
                value={value}
                modules={modules}
                formats={formats}
                bounds=".app"
                placeholder={placeholder}
                style={{ height: "30vh" }}
            />
            {/* <div className="themeSwitcher">
                <label>Theme </label>
                <select onChange={(e) => handleThemeChange(e.target.value)}>
                    <option value="snow">Snow</option>
                    <option value="bubble">Bubble</option>
                    <option value="core">Core</option>
                </select>
            </div> */}
        </div>
    );
};

Editor.propTypes = {
    placeholder: PropTypes.string,
};

export default Editor;
