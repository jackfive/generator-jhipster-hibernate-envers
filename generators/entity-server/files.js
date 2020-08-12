/**
 * Copyright 2013-2017 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see http://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * The default is to use a file path string. It implies use of the template method.
 * For any other config an object { file:.., method:.., template:.. } can be used.
 */

const constants = require('generator-jhipster/generators/generator-constants');

/* Constants use throughout */
const INTERPOLATE_REGEX = constants.INTERPOLATE_REGEX;
const SERVER_MAIN_RES_DIR = constants.SERVER_MAIN_RES_DIR;
const SERVER_MAIN_SRC_DIR = constants.SERVER_MAIN_SRC_DIR;

const customServerFiles = {
    dbChangelogAudit: [
        {
            condition: generator => generator.databaseType === 'sql' && !generator.skipDbChangelog,
            path: SERVER_MAIN_RES_DIR,
            templates: [
                {
                    file: 'config/liquibase/changelog/added_entity_aud.xml',
                    options: { interpolate: INTERPOLATE_REGEX },
                    renameTo: generator =>
                        `config/liquibase/changelog/${generator.changelogDate}_added_entity_${generator.entityClass}_aud.xml`
                }
            ]
        },
        {
            condition: generator => generator.databaseType === 'sql' && !generator.skipDbChangelog,
            path: SERVER_MAIN_RES_DIR,
            templates: [
                {
                    file: 'config/liquibase/changelog/added_entity_constraints_aud.xml',
                    options: { interpolate: INTERPOLATE_REGEX },
                    renameTo: generator =>
                        `config/liquibase/changelog/${generator.changelogDate}_added_entity_constraints_${generator.entityClass}_aud.xml`
                }
            ]
        }
    ],
    server: [
        {
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/domain/Entity.java',
                    renameTo: generator => `${generator.packageFolder}/domain/${generator.asEntity(generator.entityClass)}.java`
                },
                {
                    file: 'package/config/Revision.java',
                    renameTo: generator => `${generator.packageFolder}/config/Revision.java`
                },
                {
                    file: 'package/config/RevisionListenerImpl.java',
                    renameTo: generator => `${generator.packageFolder}/config/RevisionListenerImpl.java`
                }
            ]
        }
    ]
};

module.exports = {
    writeFiles
};

function writeFiles() {
    if (this.skipServer) return;

    // write server side files
    this.writeFilesToDisk(customServerFiles, this, false);

    if (this.databaseType === 'sql') {
        if (!this.skipDbChangelog) {
            if (this.fieldsContainOwnerManyToMany || this.fieldsContainOwnerOneToOne || this.fieldsContainManyToOne) {
                this.addConstraintsChangelogToLiquibase(`${this.changelogDate}_added_entity_constraints_${this.entityClass}_aud`);
            }
            this.addChangelogToLiquibase(`${this.changelogDate}_added_entity_${this.entityClass}_aud`);
        }
    }
}
