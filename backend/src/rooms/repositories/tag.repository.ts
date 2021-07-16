import { EntityRepository, Repository } from 'typeorm';
import { Tag } from '../entities/tag.entity';

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {
  async getOrCreate(names: string[]): Promise<Tag[]> {
    return await Promise.all(
      names.map(async (name) => {
        const tagName = name.trim().toLowerCase();
        const tagSlug = tagName.replace(/ /g, '-');
        let tag = await this.findOne({ slug: tagSlug });
        if (!tag) {
          tag = await this.save(this.create({ slug: tagSlug, name: tagName }));
        }
        return tag;
      }),
    );
  }
}
