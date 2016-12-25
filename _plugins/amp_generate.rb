module Jekyll
  # Defines the base class of AMP posts
  class AmpPost < Page
    def initialize(site, base, dir, post)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'
      process(@name)
      read_yaml(File.join(base, '_layouts'), 'amp.html')
      data['body']          = post.content #(Liquid::Template.parse post.content).render site.site_payload
      data['title']         = post.data['title']
      data['date']          = post.data['date']
      data['author']        = post.data['author']
      data['category']      = post.data['category']
      data['canonical_url'] = post.url
      data['image'] = post.data['image']
    end
  end
  # Generates a new AMP post for each existing post
  class AmpGenerator < Generator
    priority :low
    def generate(site)
      dir = site.config['ampdir'] || 'amp'
      site.posts.docs.each do |post|
        index = AmpPost.new(site, site.source, File.join(dir, post.id), post)
        index.render(site.layouts, site.site_payload)
        index.write(site.dest)
        site.pages << index
      end
    end
  end
end
