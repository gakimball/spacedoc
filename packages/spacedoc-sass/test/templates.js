const chai = require('chai');
const $ = require('cheerio');
const chaiCheerio = require('chai-cheerio');
const parseAndRender = require('./util/parseAndRender');
const pug = require('pug');

chai.should();
chai.use(chaiCheerio);

describe('Template', () => {
  describe('changelog', () => {
    it('renders one <li> for each use of @since', () => {
      const template = `
        include ./changelog
        +changelog(item.since)
      `;
      return parseAndRender('since', template).then(html => {
        $(html).find('li').should.have.lengthOf(3);
      });
    });
  });

  describe('code', () => {
    it('highlights a code sample', () => {
      const template = `
        include ./code
        +code("@import 'file';")
      `;
      return parseAndRender('since', template).then(html => {
        html.should.contain('hljs');
      });
    });
  });

  describe('deprecated', () => {
    it('renders a deprecation warning', () => {
      const template = `
        include ./deprecated
        +deprecated(item.deprecated)
      `;
      return parseAndRender('deprecated', template).then(html => {
        html.should.contain(`use this`);
      });
    });
  });

  describe('examples', () => {
    it('renders example code', () => {
      const template = `
        include ./examples
        +examples(item.example)
      `;
      return parseAndRender('example', template).then(html => {
        html.should.contain('Example description');
        html.should.contain('hljs');
      });
    });
  });

  describe('item', () => {
    it('renders a full item without errors', () => {
      const template = `
        include ./item
        +item(item)
      `;
      return parseAndRender('kitchen-sink', template);
    });
  });

  describe('outputs', () => {
    it('renders mixin output description', () => {
      const template = `
        include ./outputs
        +outputs(item.output)
      `;
      return parseAndRender('output', template).then(html => {
        html.should.contain('Some CSS');
      });
    });
  });

  describe('parameters', () => {
    let $html;

    before(() => {
      const template = `
        include ./parameters
        +parameters(item.parameter)
      `;
      return parseAndRender('parameters', template).then(html => {
        $html = $(html);
      });
    });

    it('renders one table row for each parameter', () => {
      $html.find('tbody tr').should.have.lengthOf(4);
    });

    it('renders the name of a param', () => {
      $html.find('tbody tr:nth-child(1)').html().should.contain('typed');
    });

    it('renders the type of a param', () => {
      $html.find('tbody tr:nth-child(2)').html().should.contain('String or Number');
    });

    it('renders the description of a param', () => {
      $html.find('tbody tr:nth-child(3)').html().should.contain('This parameter has a description');
    });

    it('renders the default value of a param', () => {
      $html.find('tbody tr:nth-child(4)').html().should.contain('bark');
    });
  });

  describe('properties', () => {
    let $html;

    before(() => {
      const template = `
        include ./properties
        +properties(item.property)
      `;
      return parseAndRender('properties', template).then(html => {
        $html = $(html);
      });
    });

    it('renders one table row for each property', () => {
      $html.find('tbody tr').should.have.lengthOf(4);
    });

    it('renders the name of a prop', () => {
      $html.find('tbody tr:nth-child(1)').html().should.contain('typed');
    });

    it('renders the type of a prop', () => {
      $html.find('tbody tr:nth-child(2)').html().should.contain('String or Number');
    });

    it('renders the description of a prop', () => {
      $html.find('tbody tr:nth-child(3)').html().should.contain('This property has a description');
    });

    it('renders the default value of a prop', () => {
      $html.find('tbody tr:nth-child(4)').html().should.contain('bark');
    });
  });

  describe('returns', () => {
    it('renders a return value type and description', () => {
      const template = `
        include ./returns
        +returns(item.return)
      `;
      return parseAndRender('returns', template).then(html => {
        html.should.contain('Number')
        html.should.contain('Zero');
      });
    });
  });

  describe('throw', () => {
    it('renders a throw description', () => {
      const template = `
        include ./throw
        +throws(item.throw)
      `;
      return parseAndRender('throws', template).then(html => {
        html.should.contain('This is an error');
      });
    });
  });
});
