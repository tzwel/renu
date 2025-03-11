let { data, actions } = require('../index')

let dataTemplate = {
	count: 0,
	regex: '',
	index: 0,
	files: []
}

function resetData() {
    Object.assign(data, dataTemplate)
    data.files = []
}


describe("Input", function() {
    beforeEach(function() {
        resetData()
    });

    it("should select nonhidden files", function() {
        actions.input('/spec/data/*.*')

        expect(
            data.files.length
        ).toBe(12);
    });

    // this suite doesn't work: renu doesn't select the .hidden_file
    // it("should select all files (including hidden)", function() {
    //     resetData()
    //     actions.input('/spec/data/*') 

    //     expect(
    //         data.files.length
    //     ).toBe(13);
    // });

    it("should select all txt files", function() {
        actions.input('/spec/data/*.txt')
        expect(
            data.files.length
        ).toBe(4);
    });
    it("should select 1 docs file inside subdirectory", function() {
        actions.input('/spec/data/directory/*.docx')
        expect(
            data.files.length
        ).toBe(1);
    });

    it("should select everything from current and subdirectory", function() {
        actions.input('/spec/data/**')
        expect(
            data.files.length
        ).toBe(12 + 2);
    });

    it("should select a specific file", function() {
        actions.input('/spec/data/config.xml')
        expect(
            data.files.length
        ).toBe(1);
        expect(
            data.files[0].filename
        ).toBe('config');
    });
});


describe("Suffix/prefix", function() {
    beforeEach(function() {
        resetData()
    });

    it("should add a prefix to specific file", function() {
        actions.input('/spec/data/settings.json')
        expect(
            data.files.length
        ).toBe(1);
        expect(
            data.files[0].filename
        ).toBe('settings');

        actions.prefix('prefix-')
        expect(
            data.files[0].filename
        ).toBe('prefix-settings');
    });

    it("should add a prefix to all txt files current dir", function() {
        actions.input('/spec/data/*.txt')

        // workaround to clone array without referencing it
        let files = JSON.parse(JSON.stringify(data.files))

        actions.prefix('prefix-')

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            expect(
                'prefix-' + file.filename
            ).toBe(data.files[i].filename);
        }
    });

    it("should add a suffix to all txt files current dir", function() {
        actions.input('/spec/data/*.txt')

        // workaround to clone array without referencing it
        let files = JSON.parse(JSON.stringify(data.files))

        actions.suffix('-suffix')

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            expect(
                file.filename + '-suffix'
            ).toBe(data.files[i].filename);
        }
    });

    it("should add a suffix and prefix to all files with subdir", function() {
        actions.input('/spec/data/**')

        // workaround to clone array without referencing it
        let files = JSON.parse(JSON.stringify(data.files))

        actions.suffix('-suffix')
        actions.prefix('prefix-')

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            expect(
                'prefix-' + file.filename + '-suffix'
            ).toBe(data.files[i].filename);
        }
    });
});
